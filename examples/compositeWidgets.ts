import compose, { ComposeFactory } from 'dojo-compose/compose';
import {
	Widget,
	WidgetOptions,
	WidgetState,
	CompositeWidget,
	CompositeWidgetOptions,
	ChildNodeFunction,
	CompositeManagerFunction,
	NodeAttributeFunction
} from '../src/widgetBases';
import { VNode, VNodeProperties } from 'maquette';

declare const compositeWidget: CompositeWidget<Widget<WidgetState>, WidgetState>;

declare const createWidget: ComposeFactory<Widget<WidgetState>, WidgetOptions<WidgetState>>;
declare const createCompositeWidget: ComposeFactory<
	CompositeWidget<Widget<WidgetState>, WidgetState>,
	CompositeWidgetOptions<Widget<WidgetState>, WidgetState>
>;

/* == Label Widget == */

type LabelState = WidgetState & { label?: string; for?: string };

type Label = Widget<LabelState>;

/* child node functions are called on render and offer up child nodes, even on "simple" Widgets */
const renderLabel: ChildNodeFunction = function renderLabel(this: Label): (VNode | string)[] {
	return [ this.state.label ];
};

/* node attribute functions are already there, but this demonstrates the "best" way to declare them */
const labelAttributes: NodeAttributeFunction = function labelAttributes(this: Label): VNodeProperties {
	return {
		for: this.state.for
	};
};

/* Here is our "final" label widget */
const createLabel: ComposeFactory<Label, WidgetOptions<LabelState>> = createWidget
	.mixin({
		mixin: {
			childNodeRenderers: [ renderLabel ],
			className: 'Label',
			nodeAttributes: [ labelAttributes ]
		}
	});

/* == CompositeLabelMixin == */

type CompositeLabelMixinState = { label?: string; id?: string; };

/* a manage label function, which creates the label when state is initialized and then sets the state
   when the state changes */
const manageLabel: CompositeManagerFunction<Label, CompositeLabelMixinState> = function manageLabel(
	this: CompositeWidget<Label, CompositeLabelMixinState>, /* this is what we think we will have at runtime */
	type: 'initialized' | 'changed' | 'completed' /* the three lifecycle types */
) {
	const label = this.state.label;
	const forId = this.state.id;
	if (type === 'initialized') {
		/* for managing sub-widgets, there is the instance.widget interface, where we can create/add/get our sub widgets */
		this.widgets.create({
			label: 'label', /* local namespace reference */
			options: {
				state: { label, for: forId }
			},
			factory: createLabel
		}); /* widgets.create will manage the destruction handlers for use, so we don't have to worry */
	}
	else if (type === 'changed') {
		/* here we can get our reference to the subwidget */
		this.widgets.get('label').setState({ label, for: forId });
	}
};

/* We don't need the rest of the interface, while it won't work standalone, we "assume" it will eventually
 * get mixed into a composite widget */
const createCompositeLabelMixin = compose({
	managers: [ manageLabel ]
});

/* == CompositeLabel == */

type CompositeLabelState = WidgetState & CompositeLabelMixinState;

type CompositeLabel = CompositeWidget<Widget<WidgetState>, CompositeLabelState>;

type CompositeLabelOptions = CompositeWidgetOptions<Widget<WidgetState>, CompositeLabelState>;

/* here, we finally mix it into the final composite widget, the default render will automatically
   render the children via the default sort order, we can of course provide a custom sort function
   which will specify the order we want our subwidgets rendered in */
const createCompositeLabel: ComposeFactory<CompositeLabel, CompositeLabelOptions> = createCompositeWidget
	.mixin({
		className: 'CompositeLabel',
		mixin: createCompositeLabelMixin
	});

/* -- Instantiate a widget -- */

const labelWidget = createCompositeLabel();

labelWidget.render();
