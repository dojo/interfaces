/**
 * This definition module contains interfaces that are partial interfaces of likely larger interfaces
 * which have a very narrow ability which the a consumer might want to guard against or interface with
 *
 * It is very unlikely that these interfaces would be actually implemented as they stand
 */

import Promise from 'dojo-shim/Promise';
import { List, Map } from 'immutable';
import { VNode } from 'maquette';
import { Destroyable } from './bases';
import { EventTargettedObject, Handle } from './core';
import { Observable } from './observables';

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

export interface Invalidatable {
	/**
	 * Signal to the instance that it is in an invalide state
	 */
	invalidate(): void;
}

export interface Renderable extends Destroyable, Invalidatable {
	/**
	 * Takes no arguments and returns a VNode
	 */
	render(): VNode;

	/**
	 * The tag name to be used
	 */
	tagName: string;
}

export interface RenderableChild extends Renderable, Invalidatable {
	/**
	 * The ID of the child
	 */
	readonly id: string;

	/**
	 * A reference to the child's parent
	 */
	parent: RenderableParent | null;
}

export interface RenderableParent extends Renderable, Invalidatable {
	/**
	 * Append the child to the children which are managed by the parent
	 *
	 * @param child The child to append
	 */
	append(child: RenderableChild[] | RenderableChild): Handle;

	/* TODO: Add Insert API */

	/**
	 * The immutable list of children *owned* by the parent
	 */
	readonly children: Map<string, RenderableChild> | List<RenderableChild>;
}

export interface StoreObservable<T> {
	/**
	 * A method that allows the return of an `Observable` interface for a particular `id`
	 * @param id The ID to observe
	 */
	observe(id: string): Observable<T>;
}

export type StoreObservablePatchable<T> = StoreObservable<T> & StorePatchable<T>;

export interface StorePatchable<T> {
	/**
	 * A method that allows an partial object to be passed to patch the object
	 * and receive the full object back as a resolution to a Promise
	 * @param partial The partial object to be *patched*
	 * @param options A map of options, which includes the `id` being patched
	 */
	patch(partial: any, options?: { id?: string }): Promise<T>;
}
