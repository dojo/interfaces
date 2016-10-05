import { Widget, WidgetState, CompositeWidget, ContainerListWidget, ContainerMapWidget } from '../src/widgetBases';
import { Factory } from '../src/core';

declare const widget: Widget<WidgetState>;
declare const createWidget: Factory<Widget<WidgetState>, any>;
declare const compositeWidget: CompositeWidget<Widget<WidgetState>, WidgetState>;
declare const containerListWidget: ContainerListWidget<Widget<WidgetState>, WidgetState>;
declare const containerMapWidget: ContainerMapWidget<Widget<WidgetState>, WidgetState>;

containerListWidget.insert(widget, 'before', widget);

containerListWidget.createChild({ factory: createWidget, options: {} });
containerMapWidget.createChild({ factory: createWidget, options: {}, label: 'foo' });

containerListWidget.createChildren([ [ createWidget, undefined ] ]);
