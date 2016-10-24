import * as registerSuite from 'intern!object';
import { getTypeForFiles } from '../support/util';
import assertType from '../support/assertType';

registerSuite({
	name: 'widgetBases.d',
	'validate types'() {
		const file = 'src/widgetBases.d.ts';
		const types = getTypeForFiles(file);
		const widgetBasesTypes = types[file];
		assertType.isType(widgetBasesTypes, 'ChildNodeFunction', 'ChildNodeFunction');
		assertType.isType(widgetBasesTypes, 'NodeAttributeFunction', 'NodeAttributeFunction');
		assertType.isType(widgetBasesTypes, 'ChildrenChangeEvent', 'ChildrenChangeEvent<T>');
		assertType.isType(widgetBasesTypes, 'CompositeManagerFunction', 'CompositeManagerFunction<W, S>');
		assertType.isType(widgetBasesTypes, 'CompositeMixin', 'CompositeMixin<W, S>');
		assertType.isType(widgetBasesTypes, 'CompositeWidget', 'CompositeWidget<W, S>');
		assertType.isType(widgetBasesTypes, 'ContainerWidgetMixin', 'ContainerWidgetMixin<C>');
		assertType.isType(widgetBasesTypes, 'ContainerWidget', 'ContainerWidget<C, S>');
		assertType.isType(widgetBasesTypes, 'ContainerWidgetOptions', 'ContainerWidgetOptions<C, S>');
		assertType.isType(widgetBasesTypes, 'ContainerWidgetState', 'ContainerWidgetState');
		assertType.isType(widgetBasesTypes, 'CreateWidgetList', '([Factory<W, O>, O] | [Factory<W, O>])[]');
		assertType.isType(widgetBasesTypes, 'CreateWidgetMap', 'CreateWidgetMap<W, O>');
		assertType.isType(widgetBasesTypes, 'CreateWidgetOptions', 'CreateWidgetOptions<C, O>');
		assertType.isType(widgetBasesTypes, 'CreateWidgetResults', 'CreateWidgetResults<W>');
		assertType.isType(widgetBasesTypes, 'SubWidgetManager', 'SubWidgetManager<W>');
		assertType.isType(widgetBasesTypes, 'Widget', 'Widget<S>');
		assertType.isType(widgetBasesTypes, 'WidgetMixin', 'WidgetMixin');
		assertType.isType(widgetBasesTypes, 'WidgetOptions', 'WidgetOptions<S>');
		assertType.isType(widgetBasesTypes, 'WidgetState', 'WidgetState');
	}
});
