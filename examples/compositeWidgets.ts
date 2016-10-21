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
import Promise from 'dojo-shim/Promise';
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
	const forId = `input-${this.state.id}`;
	const state: LabelState = { label, for: forId };
	if (type === 'initialized') {
		/* for managing sub-widgets, there is the instance.widget interface, where we can create/add/get our sub widgets */
		this.widgets.create({
			label: 'label', /* local namespace reference */
			options: {
				state
			},
			factory: createLabel
		}); /* widgets.create will manage the destruction handlers for use, so we don't have to worry */
	}
	else if (type === 'changed') {
		/* here we can get our reference to the subwidget */
		this.widgets.get('label').setState(state);
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

/* -- What if I wanted "n" labels, and didn't plan to reuse the manager logic? -- */

type CompositeLabelListState = WidgetState & { labels?: string[] };

/* bake all the logic into a single manager function */
const manageLabelList: CompositeManagerFunction<Label, CompositeLabelListState> = function manageLabelList(
	this: CompositeLabelList, /* this is what we think we will have at runtime */
	type: 'initialized' | 'changed' | 'completed' /* the three lifecycle types */
) {
	if (type === 'completed') {
		return;
	}
	/* there maybe more efficient ways to deal with this, but you get the idea */
	const widgets = this.widgets;
	const currentSize = widgets.size;
	const labels = this.state.labels;
	const labelsLength = (labels && labels.length) || 0;
	const promises: Promise<any>[] = [];

	if (currentSize < labelsLength) {
		for (let i = (currentSize - 1); i < labelsLength; i++) {
			promises.push(widgets.create({
				factory: createLabel,
				label: String(i)
			}));
		}
	}
	else if (currentSize > labelsLength) {
		for (let i = (labelsLength - 1); i < currentSize; i++) {
			widgets.get(String(i)).destroy();
		}
	}

	Promise.all(promises).then(() => {
		labels.forEach((label, idx) => {
			widgets.get(String(idx)).setState({ label });
		});
	});
};

type CompositeLabelList = CompositeWidget<Label, CompositeLabelListState>;

const createCompositeLabelList: ComposeFactory<CompositeLabelList, WidgetOptions<CompositeLabelListState>> = createCompositeWidget
	.mixin({
		className: 'CompositeLabelList',
		mixin: {
			managers: [ manageLabelList ]
		}
	});

/* now we will have a label subwidget for every label in the `labels` array */
const compositeLabelList = createCompositeLabelList({
	state: { labels: [ 'foo', 'bar', 'baz' ] }
});

compositeLabelList.widgets.size === 3;

/* -- What if I want a text box and and a label composite widget -- */

/* == Textbox == */

type TextboxState = WidgetState & { value?: string, name?: string };

type Textbox = Widget<TextboxState>;

const renderTextboxValue: ChildNodeFunction = function renderLabel(this: Textbox): (VNode | string)[] {
	return [ this.state.value ];
};

const textboxAttributes: NodeAttributeFunction = function labelAttributes(this: Textbox): VNodeProperties {
	return {
		type: 'text',
		name: this.state.name
	};
};

const createTextbox: ComposeFactory<Textbox, WidgetOptions<TextboxState>> = createWidget
	.mixin({
		mixin: {
			childNodeRenderers: [ renderTextboxValue ],
			className: 'Textbox',
			nodeAttributes: [ textboxAttributes ]
		}
	});

/* == CompositeTextboxMixin == */

type CompositeTextboxMixinState = { value?: string; id?: string; };

const manageTextbox: CompositeManagerFunction<Textbox, CompositeTextboxMixinState> = function manageLabel(
	this: CompositeWidget<Textbox, CompositeTextboxMixinState>,
	type: 'initialized' | 'changed' | 'completed'
) {
	const value = this.state.value;
	const id = `input-${this.state.id}`;
	const state: TextboxState = { value, id, name: id };
	if (type === 'initialized') {
		this.widgets.create({
			label: 'textbox',
			options: { state },
			factory: createTextbox
		});
	}
	else if (type === 'changed') {
		this.widgets.get('textbox').setState(state);
	}
};

const createCompositeTextboxMixin = compose('CompositeTextboxMixin', {
	managers: [ manageTextbox ]
});

/* == LabelTextbox == */

type LabelTextboxState = WidgetState & CompositeLabelMixinState & CompositeTextboxMixinState;

type LabelTextbox = CompositeWidget<Widget<WidgetState>, LabelTextboxState>;

type LabelTextboxOptions = CompositeWidgetOptions<Widget<WidgetState>, LabelTextboxState>;

const createLabelTextbox: ComposeFactory<LabelTextbox, LabelTextboxOptions> = createCompositeWidget
	.mixin(createCompositeLabelMixin)
	.mixin({
		className: 'LabelTextbox',
		mixin: createCompositeTextboxMixin
	});

/* create an instance */
const labelTextbox = createLabelTextbox({
	id: 'labelTextbox',
	state: {
		label: 'My Textbox',
		value: 'foo'
	}
});

labelTextbox.render();
