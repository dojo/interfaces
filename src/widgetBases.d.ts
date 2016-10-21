/**
 * These represent the base classes for widgets, which have base implementations.
 *
 * These bases though will likely have signficant cross cutting concerns and therefore are located here.
 *
 * Additional features and functionality are added to widgets by compositing mixins onto these
 * bases.
 *
 * The main interfaces that are defined in this module are:
 *   - Widget
 *   - CompositeWidget
 *   - ContainerListWidget
 *   - ContainerMapWidget
 */

import Promise from 'dojo-shim/Promise';
import { List, Map } from 'immutable';
import { VNode, VNodeProperties } from 'maquette';
import { Renderable, RenderableParent } from './abilities';
import { EventedListener, State, Stateful, StatefulOptions } from './bases';
import { EventTargettedObject, Factory, Handle, StylesMap } from './core';

/**
 * A function that is called when collecting the children nodes on render, accepting the current list of
 * children nodes and returning a list of children ndoes that should be appended onto the current list.
 *
 * TODO: Should this behave more like a reducer (like above)?
 */
export interface ChildNodeFunction {
	(this: Widget<WidgetState>, childrenNodes: (VNode | string)[]): (VNode | string)[];
}

/**
 * A function that is called when collecting the node attributes on render, accepting the current map of
 * attributes and returning a set of VNode properties that should mixed into the current attributes.
 *
 * TODO: Should this act more like an actualy reducer, where the previousValue is passed in and is mutated directly,
 *       along with the instance reference?  Something like (previousAttributes: VNodeProperties, instance: WidgetMixin): VNodeProperties
 */
export interface NodeAttributeFunction {
	/**
	 * A function which can return additional VNodeProperties which are
	 *
	 * @param attributes The current VNodeProperties that will be part of the render
	 */
	(this: Widget<WidgetState>, attributes: VNodeProperties): VNodeProperties;
}

export interface ChildrenChangeEvent<T> {
	/**
	 * The subject of the event
	 */
	target: T;

	/**
	 * The type of the event
	 */
	type: 'children:change';
}

export interface CompositeManagerFunction<W extends Renderable, S extends WidgetState> {
	/**
	 * A function which allows the management of the subwidgets of a composite widget
	 *
	 * @param instance A reference to the composite widget instance
	 * @param type The lifecycle stage of the composite widget, which the manager can modify
	 *             its behaviour to reflect this stage
	 */
	(this: CompositeWidget<W, S>, type: 'initialized' | 'changed' | 'completed'): void;
}

export interface CompositeMixin<W extends Renderable, S extends WidgetState> {
	/**
	 * Signal to the composite widget that it needs to ensure that it is an internally consistent state.
	 *
	 * This method is usually called during a state change of the composite widget and is the signal that
	 * the composite widget should update the state of its subwidgets.
	 */
	manage(): void;

	/**
	 * An array of functions which allow mixins to provide logic that should be run as part of the manage
	 * cycle of the composite widget
	 */
	managers: CompositeManagerFunction<W, S>[];

	/**
	 * A sub interface which allows management of the subwidgets of this composite widget
	 */
	readonly widgets: SubWidgetManager<W>;
}

/**
 * The *final* type for the CompositeWidget
 */
export type CompositeWidget<W extends Renderable, S extends WidgetState> = Widget<S> & CompositeMixin<W, S>;

export interface CompositeWidgetOptions<W extends Renderable, S extends WidgetState> extends WidgetOptions<S> {
	/**
	 * Any widget manager functions that should be added to this instance
	 */
	managers?: CompositeManagerFunction<W, S> | CompositeManagerFunction<W, S>[];

	/**
	 * A map of widgets that should be created as subwidgets during the instantiation of this instance
	 */
	widgets?: CreateWidgetMap<W, WidgetOptions<WidgetState>>;
}

export interface ContainerListMixin<C extends Renderable> {
	/**
	 * Append a child to the end of the children associated with this widget
	 *
	 * @param child The child to append
	 */
	append(child: C | C[]): Handle;

	/**
	 * An immutable list of children *owned* by the widget
	 */
	readonly children: List<C>;

	/**
	 * Remove all the children from the widget, but do not destroy them
	 */
	clear(): void;

	/**
	 * Create a child and append it to the children owned by this widget
	 *
	 * @param options The `factory` and possibly `options` to pass the factory upon construction
	 */
	createChild<D extends C, O extends WidgetOptions<WidgetState>>(options: CreateWidgetListOptions<D, O>): Promise<[string, D]>;

	/**
	 * Create a list of children and append them to the children owned by this widget
	 *
	 * @param children A tuple list of children made up of the factory and the options to pass to the factory
	 */
	createChildren<O extends WidgetOptions<WidgetState>>(children: CreateWidgetList<C, O>): Promise<CreateWidgetResults<C>>;

	/**
	 * Insert a child into the list of children owned by this widget
	 *
	 * @param child The child to insert
	 * @param position The position to insert the child into
	 */
	insert(child: C, position: number | 'first' | 'last'): Handle;

	/**
	 * Insert a child into the list of children owned by this widget
	 *
	 * @param child The child to insert
	 * @param position The position to insert the child into
	 * @param reference When inserting into a relative position, the reference child that the `child` is relative to
	 */
	insert(child: C, position: 'before' | 'after', reference: C): Handle;

	/**
	 * Add a listener to the `children:change` event which is fired when there is a change in the children of the widget
	 *
	 * @param type The event type to listen for
	 * @param listener The event listener which will be called when the event is emitted
	 */
	on(type: 'children:change', listener: EventedListener<
		ContainerListWidget<C, ContainerListWidgetState>,
		ChildrenChangeEvent<ContainerListWidget<C, ContainerListWidgetState>>
	>): Handle;

	/**
	 * Called (if present) when children are rendered to ensure that the children are rendered in the correct order.
	 *
	 * If the function returns `-1` then `childA` comes before `childB`, if `0` is returned the order remains unchanged, and
	 * if `1` is returned `childB` comes before `childA`.
	 *
	 * @param childA The first child to compare
	 * @param childB The second child to compare
	 */
	sort?(childA: C, childB: C): 0 | 1 | -1;
}

/**
 * The *final* type for ContainerListWidget
 */
export type ContainerListWidget<C extends Renderable, S extends ContainerListWidgetState> = Widget<S> & ContainerListMixin<C>;

export interface ContainerListWidgetOptions<C extends Renderable, S extends ContainerListWidgetState> extends WidgetOptions<S> {
	/**
	 * A list of children to be created and added to the container at creation time
	 */
	createChildren?: [Factory<C, WidgetOptions<WidgetState>>, WidgetOptions<WidgetState> ]
		| [Factory<C, WidgetOptions<WidgetState>>]
		| CreateWidgetList<C, WidgetOptions<WidgetState>>;

	/**
	 * Provide a sort function for this instance which will sort the children renders at render time
	 */
	sort?(childA: C, childB: C): 0 | 1 | -1;
}

export interface ContainerListWidgetState extends WidgetState {
	/**
	 * The IDs of the children which are currently owned by the containing widget
	 */
	children: string[];
}

export interface ContainerMapMixin<C extends Renderable> {
	/**
	 * Append a child to the end of the children associated with this widget
	 *
	 * Because no label is supplied, the `child.id` will be used for the label
	 *
	 * @param child The child to append
	 */
	append(child: C | C[]): Handle;

	/**
	 * Append a child to the end of the children associated with this widget
	 *
	 * @param label The label for the child in the children map
	 * @param child The child to append
	 */
	append(label: string, child: C | C[]): Handle;

	/**
	 * A immutable map of children owned by this widget
	 */
	readonly children: Map<string, C>;

	/**
	 * Remove all the children from the widget, but do not destroy them
	 */
	clear(): void;

	/**
	 * Create a child and add it to the children owned by this widget
	 *
	 * @param options The `factory` and possibly `options` to pass the factory upon construction and `label`.  If `label` is omitted
	 *                then the created child's `.id` will be used as the key for the children map
	 */
	createChild<D extends C, O extends WidgetOptions<WidgetState>>(options: CreateWidgetMapOptions<D, O>): Promise<[string, D]>;

	/**
	 * Create a map of children and add them to the children owned by this widget
	 *
	 * @param children A map of children, where the key is the `label` the child should be added as with a value of an object
	 *                 which contains the `factory` use to create the child and optionally any `options` to pass to the factory
	 */
	createChildren<O extends WidgetOptions<WidgetState>>(children: CreateWidgetMap<C, O>): Promise<CreateWidgetResults<C>>;

	/**
	 * Add a listener to the `children:change` event which is fired when there is a change in the children of the widget
	 *
	 * @param type The event type to listen for
	 * @param listener The event listener which will be called when the event is emitted
	 */
	on(type: 'children:change', listener: EventedListener<
		ContainerMapWidget<C, ContainerMapWidgetState>,
		ChildrenChangeEvent<ContainerMapWidget<C, ContainerMapWidgetState>>
	>): Handle;

	/**
	 * Called (if present) when children are rendered to ensure that the children are rendered in the correct order.
	 *
	 * If the function returns `-1` then `childA` comes before `childB`, if `0` is returned the order remains unchanged, and
	 * if `1` is returned `childB` comes before `childA`.
	 *
	 * @param childA A tuple containing the label and reference to the first child
	 * @param childB A tuple containing the label and reference to the second child
	 */
	sort(childA: [string, C], childB: [string, C]): 0 | 1 | -1;
}

export type ContainerMapWidget<C extends Renderable, S extends ContainerMapWidgetState> = Widget<S> & ContainerMapMixin<C>;

export interface ContainerMapWidgetOptions<C extends Renderable, S extends ContainerMapWidgetState> extends WidgetOptions<S> {
	/**
	 * A map of children to be created and added to the container at creation time
	 */
	createChildren?: CreateWidgetMap<C, WidgetOptions<WidgetState>>;

	/**
	 * Provide a sort function for this instance which will replace the default sort of the children renders at render time
	 */
	sort?(childA: C, childB: C): 0 | 1 | -1;
}

export interface ContainerMapWidgetState extends WidgetState {
	/**
	 * A map of children labels and their IDs currently owned by the containing widget
	 */
	children: { [label: string]: string; };
}

export type CreateWidgetList<W extends Renderable, O extends WidgetOptions<WidgetState>> = ([Factory<W, O>, O ] | [Factory<W, O>])[];

export interface CreateWidgetMap<W extends Renderable, O extends WidgetOptions<WidgetState>> {
	[label: string]: {
		factory: Factory<W, O>;
		options?: O;
	};
}

export interface CreateWidgetListOptions<C extends Renderable, O extends WidgetOptions<WidgetState>> {
	/**
	 * The factory to use in creating the child
	 */
	factory: Factory<C, O>;

	/**
	 * Any options to pass to the factory when creating the child
	 */
	options?: O;
}

export interface CreateWidgetMapOptions<C extends Renderable, O extends WidgetOptions<WidgetState>> extends CreateWidgetListOptions<C, O> {
	/**
	 * The label to assign the child to, if omitted, the child's `.id` property will be used
	 */
	label?: string;
}

/**
 * Interface that provides a map of widgets, used when returning from a creation API
 */
export interface CreateWidgetResults<W extends Renderable> {
	[label: string]: W;
}

export interface SubWidgetManager<W extends Renderable> {
	/**
	 * Adds a sub widget to the widgets directly managed by the composite widget
	 *
	 * @param label The label which the widget should be referenced by
	 * @param widget The instance of the widget to add
	 */
	add(label: string, widget: W): Handle;

	/**
	 * Create an instance of a widget based on the a passed factory and add it to the widgets directly managed
	 * by the composite widget
	 *
	 * @param label The label which the widget should be referenced by
	 * @param factory The factory which will return an instance when called
	 * @param options Any options to pass to the factory upon construction
	 */
	create<V extends W,  O extends WidgetOptions<WidgetState>>(options: CreateWidgetMapOptions<V, O>): Promise<[string, V]>;

	/**
	 * Create instances of widgets based on the passed map of widget factories which are passed
	 *
	 * @param widgetFactories A map where the key is the label and the value is an object which provides the factory and
	 *                        any options that should be passed to the constructor
	 */
	create<O extends WidgetOptions<WidgetState>>(widgetFactories: CreateWidgetMap<W, O>): Promise<CreateWidgetResults<W>>;

	/**
	 * Retrieve an instance of a widget which is part of the composite widget
	 */
	get<V extends W>(label: string): V | undefined;

	/**
	 * Returns `true` if the label is currently registered with the composite widget, otherwise returns `false`
	 */
	has(label: string): boolean;
}

export type Widget<S extends WidgetState> = Stateful<S> & WidgetMixin;

export interface WidgetMixin {
	/**
	 * An array of child node render functions which are executed on a render to generate the children
	 * nodes.  These are intended to be "static" and bound to the class, making it easy for mixins to
	 * alter the behaviour of the render process without needing to override or aspect the `getChildrenNodes`
	 * method.
	 */
	childNodeRenderers: ChildNodeFunction[];

	/**
	 * Classes which are applied upon render.
	 *
	 * This property is intended for "static" classes.  Classes which are aligned to the instance should be
	 * stored in the instances state object.
	 */
	readonly classes: string[];

	/**
	 * Generate the children nodes when rendering the widget.
	 *
	 * Mixins should not override or aspect this method, but instead provide a function as part of the
	 * `childNodeRenders` property, which will automatically get called by this method upon render.
	 */
	getChildrenNodes(): (VNode | string)[];

	/**
	 * Generate the node attributes when rendering the widget.
	 *
	 * Mixins should not override or aspect this method, but instead provide a function as part of the
	 * `nodeAttributes` property, which will automatically get called by this method upon render.
	 */
	getNodeAttributes(): VNodeProperties;

	/**
	 * The ID of the widget, which gets automatically rendered in the VNode property `data-widget-id` when
	 * rendered.
	 */
	readonly id: string;

	/**
	 * Signal to the widget that it is in an invalid state and that it should not re-use its cache on the
	 * next render.
	 *
	 * Calls to invalidate, will also cause the widget to invalidate its parent, if assigned.
	 */
	invalidate(): void;

	/**
	 * An array of functions that return a map of VNodeProperties which should be mixed into the final
	 * properties used when rendering this widget.  These are intended to be "static" and bund to the class,
	 * making it easy for mixins to alter the behaviour of the render process without needing to override or aspect
	 * the `getNodeAttributes` method.
	 */
	nodeAttributes: NodeAttributeFunction[];

	/**
	 * Attach a listener to the invalidated event, which is emitted when the `.invalidate()` method is called
	 *
	 * @param type The event type to listen for
	 * @param listener The listener to call when the event is emitted
	 */
	on(type: 'invalidated', listener: EventedListener<Widget<WidgetState>, EventTargettedObject<Widget<WidgetState>>>): Handle;

	/**
	 * Render the widget, returing the virtual DOM node that represents this widget.
	 *
	 * It is not intended that mixins will override or aspect this method, as the render process is decomposed to
	 * allow easier modification of behaviour of the render process.  The base implementatin intelligently caches
	 * its render and essentially provides the following return for the method:
	 *
	 * ```typescript
	 * return h(this.tagName, this.getNodeAttributes(), this.getChildrenNodes());
	 * ```
	 */
	render(): VNode;

	/**
	 * The tagName (selector) that should be used when rendering the node.
	 *
	 * If there is logic that is required to determine this value on render, a mixin should consider overriding
	 * this property with a getter.
	 */
	tagName: string;
}

export interface WidgetOptions<S extends WidgetState> extends StatefulOptions<S> {
	/**
	 * Any child node render functions that should be added to this instance
	 */
	childNodeRenderers?: ChildNodeFunction | ChildNodeFunction[];

	/**
	 * Any classes that should be added to this instances
	 */
	classes?: string[];

	/**
	 * Any node attribute functions that should be added to this instance
	 */
	nodeAttributes?: NodeAttributeFunction| NodeAttributeFunction[];

	/**
	 * A parent to assign to this widget at creation time
	 */
	parent?: RenderableParent;

	/**
	 * Override the tag name for this widget instance
	 */
	tagName?: string;
}

export interface WidgetState extends State {
	/**
	 * Any classes that should be mixed into the widget's VNode upon render.
	 *
	 * Any classes expressed in state will be additive to those provided in the widget's `.classes` property
	 */
	classes?: string[];

	/**
	 * The ID of the widget
	 */
	id?: string;

	/**
	 * Any inline styles which should be mixed into the widget's VNode upon render.
	 */
	styles?: StylesMap;
}
