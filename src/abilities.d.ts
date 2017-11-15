/**
 * This definition module contains interfaces that are partial interfaces of likely larger interfaces
 * which have a very narrow ability which the a consumer might want to guard against or interface with
 *
 * It is very unlikely that these interfaces would be actually implemented as they stand
 */

import { EventTargettedObject } from './core';

/**
 * The abstract interface for items that are Actionable
 */
export interface Actionable<T, E extends EventTargettedObject<T>> {
	/**
	 * The *do* method of an Action, which can take a `options` property of an `event`
	 *
	 * @param options Options passed which includes an `event` object
	 */
	do(options?: ActionableOptions<T, E>): any;
}

/**
 * A base interface for typing the options which are passed to an Actionable
 */
export interface ActionableOptions<T, E extends EventTargettedObject<T>> {
	[ option: string ]: any;

	/**
	 * An event object
	 */
	event: E;
}
