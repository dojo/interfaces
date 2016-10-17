import { ComposeFactory } from 'dojo-compose/compose';
import {
	Widget,
	WidgetOptions,
	WidgetState,
	CompositeWidget,
	CompositeWidgetOptions,
	ContainerWidget,
	ContainerWidgetOptions,
	ContainerWidgetState
} from '../src/widgetBases';

declare const widget: Widget<WidgetState>;
declare const compositeWidget: CompositeWidget<Widget<WidgetState>, WidgetState>;
declare const containerWidget: ContainerWidget<Widget<WidgetState>, ContainerWidgetState>;

declare const createWidget: ComposeFactory<Widget<WidgetState>, WidgetOptions<WidgetState>>;
declare const createCompositeWidget: ComposeFactory<
	CompositeWidget<Widget<WidgetState>, WidgetState>,
	CompositeWidgetOptions<Widget<WidgetState>, WidgetState>
>;
declare const createContainerListWidget: ComposeFactory<
	ContainerWidget<Widget<WidgetState>, ContainerWidgetState>,
	ContainerWidgetOptions<Widget<WidgetState>, ContainerWidgetState>
>;

/* Interfaces allow ComposeFactory to be superset of Factory */

/* interface validates child options */
containerWidget.createChild({ factory: createWidget, options: {
	classes: [ 'foo' ]
} });

/* interface allows label with map widget, defaults to `widget.id` */
containerWidget.createChild({ factory: createWidget, options: {}, label: 'foo' });

/* Interfaces allow [ factory, options ] or just [ factory ] */
containerWidget.createChildren([ [ createWidget ] ]);
containerWidget.createChildren([ [ createWidget, { tagName: 'widget-bar' } ] ]);

/* creating children via a map */
containerWidget.createChildren({
		foo: {
			factory: createWidget,
			options: {}
		},
		bar: {
			factory: createWidget
		}
	})
	.then((widgets) => {
		Object.keys(widgets).forEach((label) => {
			const widget = widgets[label];
			widget.id;
		});
	});

/* creating subwidgets at creation */
const compositeWidget2 = createCompositeWidget({
	widgets: {
		foo: { factory: createWidget, options: { tagName: 'bar' } }
	}
});

/* creating subwidgets */
compositeWidget2.widgets.create({ factory: createWidget });
compositeWidget2.widgets.create({ bar: { factory: createWidget, options: { tagName: 'baz' } } });

/* widgets should now emit invalidated events when invalidated, which parents should listen for */
widget.on('invalidated', (e) => {
	e.type;
});
