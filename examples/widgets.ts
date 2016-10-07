import { ComposeFactory } from 'dojo-compose/compose';
import {
	Widget,
	WidgetOptions,
	WidgetState,
	CompositeWidget,
	CompositeWidgetOptions,
	ContainerListWidget,
	ContainerListWidgetOptions,
	ContainerListWidgetState,
	ContainerMapWidget,
	ContainerMapWidgetOptions,
	ContainerMapWidgetState
} from '../src/widgetBases';

declare const widget: Widget<WidgetState>;
declare const compositeWidget: CompositeWidget<Widget<WidgetState>, WidgetState>;
declare const containerListWidget: ContainerListWidget<Widget<WidgetState>, ContainerListWidgetState>;
declare const containerMapWidget: ContainerMapWidget<Widget<WidgetState>, ContainerMapWidgetState>;

declare const createWidget: ComposeFactory<Widget<WidgetState>, WidgetOptions<WidgetState>>;
declare const createCompositeWidget: ComposeFactory<
	CompositeWidget<Widget<WidgetState>, WidgetState>,
	CompositeWidgetOptions<Widget<WidgetState>, WidgetState>
>;
declare const createContainerListWidget: ComposeFactory<
	ContainerListWidget<Widget<WidgetState>, ContainerListWidgetState>,
	ContainerListWidgetOptions<Widget<WidgetState>, ContainerListWidgetState>
>;
declare const createContainerMapWidget: ComposeFactory<
	ContainerMapWidget<Widget<WidgetState>, ContainerMapWidgetState>,
	ContainerMapWidgetOptions<Widget<WidgetState>, ContainerMapWidgetState>
>;

/* 'first', 'last', number omit 3rd argument, 'before', 'after' require 3rd argument */
containerListWidget.insert(widget, 'first');
containerListWidget.insert(widget, 'before', widget);

/* Interfaces allow ComposeFactory to be superset of Factory */

/* interface validates child options */
containerListWidget.createChild({ factory: createWidget, options: {
	classes: [ 'foo' ]
} });

/* interface allows label with map widget, defaults to `widget.id` */
containerMapWidget.createChild({ factory: createWidget, options: {}, label: 'foo' });

/* Interfaces allow [ factory, options ] or just [ factory ] */
containerListWidget.createChildren([ [ createWidget ] ]);
containerListWidget.createChildren([ [ createWidget, { tagName: 'widget-bar' } ] ]);

/* creating children via a map */
containerMapWidget.createChildren({
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
