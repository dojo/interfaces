/**
 * This definition module contains interfaces that are partial interfaces of likely larger interfaces
 * which have a very narrow ability which the a consumer might want to guard against or interface with
 *
 * It is very unlikely that these interfaces would be actually implemented as they stand
 */

import Promise from 'dojo-shim/Promise';
import Map from 'dojo-shim/Map';
import { Destroyable, EventedListener } from './bases';
import { EventTargettedObject, Factory, Handle } from './core';
import { Observable } from './observables';
import { VNode } from './vdom';

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

export interface CreatableRegistry<T> extends IdentifiableRegistry<T> {
	/**
	 * Realize a child of the specified parent, returning a promise which resolves with
	 * a tuple that contains the ID and the realized instance.
	 *
	 * @param parent The parent where the realized child should be attached to
	 * @param factory The factory that should be used to realize the child
	 * @param options Any options that should be passed to the factory when realizing the child
	 */
	create<U extends T, O>(factory: Factory<U, O>, options?: O): Promise<[ string, U ]>;
}

export interface IdentifiableRegistry<T> {
	/**
	 * Asynchronously get an instance by its ID.
	 *
	 * @param id Identifier for the instance that is to be retrieved
	 * @return A promise for the instance. The promise rejects if no instance was found.
	 */
	get(id: string | symbol): Promise<T>;

	/**
	 * Check if the registry constains a widget with the identifier provided.
	 *
	 * @param id Identifier for the instance to check whether exists in the registry.
	 * @return A promise for the result of the has check. The promise resolves to `true` if
	 *         an instance is found and `false` otherwise.
	 */
	has(id: string | symbol): Promise<boolean>;

	/**
	 * Look up the identifier for which the given value has been registered.
	 *
	 * Throws if the value hasn't been registered.
	 *
	 * @param value The value to determine the identity for
	 * @return The identifier
	 */
	identify(value: T): string | symbol;
}

export interface Invalidatable {
	/**
	 * Signal to the instance that it is in an invalide state
	 */
	invalidate(): void;

	/**
	 * Attach a listener to the invalidated event, which is emitted when the `.invalidate()` method is called
	 *
	 * @param type The event type to listen for
	 * @param listener The listener to call when the event is emitted
	 */
	on(type: 'invalidated', listener: EventedListener<Renderable, EventTargettedObject<Renderable>>): Handle;
}

export interface Renderable extends Destroyable, Invalidatable {
	/**
	 * The ID of the child
	 */
	readonly id: string;

	/**
	 * Takes no arguments and returns a VNode
	 */
	render(): VNode;

	/**
	 * The tag name to be used
	 */
	tagName: string;
}

export interface RenderableParent extends Renderable {
	/**
	 * Append the child to the children which are managed by the parent
	 *
	 * @param child The child to append
	 */
	append(child: Renderable[] | Renderable): Handle;

	/* TODO: Add Insert API */

	/**
	 * The immutable list of children *owned* by the parent
	 */
	readonly children: Map<string, Renderable>;
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
