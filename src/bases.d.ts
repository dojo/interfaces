/**
 * These are the bases of the Dojo 2 class system, where the most common functionality is located.
 *
 * These interfaces will have specific implementations but likely have significant cross cutting concerns
 * and therefore are extracted out into this package.
 */

import Promise from 'dojo-shim/Promise';
import { Actionable, StoreObservablePatchable } from './abilities';
import { EventCancelableObject, EventErrorObject, EventObject, EventTargettedObject, EventTypedObject, Handle } from './core';

export interface Destroyable {
	/**
	 * Take a handle and *own* it, which ensures that the handle's `destroy()` method is called when the
	 * *owner* is destroyed.
	 *
	 * @param handle The handle to own
	 * @returns A handle to *unown* the passed handle
	 */
	own(handle: Handle): Handle;

	/**
	 * Invoke `destroy()` on any owned handles.
	 *
	 * @returns A promise that resolves to `true` if successful, otherwise `false`
	 */
	destroy(): Promise<boolean>;
}

/**
 * A base class, which provides the functionality of emitting events and attaching listeners to those
 * events
 */
export interface Evented extends Destroyable {
	/**
	 * Emit an event.
	 *
	 * The event is determined by the `event.type`, if there are no listeners for an event type,
	 * `emit` is essentially a noop.
	 *
	 * @param event The `EventTargettedObject` to be delivered to listeners based on `event.type`
	 */
	emit<E extends EventObject>(event: E): void;

	/**
	 * Attach a map to events *types* specified by the key of the map and the value being the *listener* or
	 * array of *listeners*.
	 *
	 * @param listeners An object which contains key value pairs of event types and listeners.
	 * @returns A handle which can be used to remove the listeners
	 */
	on<T>(listeners: EventedListenersMap<T>): Handle;

	/**
	 * Attach a listener (or array of listeners) to an `error` event.
	 *
	 * @param type The type of event to listen for (`error`)
	 * @param listener A listener or array of listeners that accept error events
	 * @returns A handle which can be used to remove the listeners
	 */
	on<T extends Evented>(type: 'error', listener: EventedListenerOrArray<T, EventErrorObject<T>>): Handle;

	/**
	 * Attach a `listener` to a particular event `type`.
	 *
	 * @param type The event to attach the listener to
	 * @param listener Either a function which takes an emitted `event` object, something that is `Actionable`,
	 *                 or an array of of such listeners.
	 * @returns A handle which can be used to remove the listener
	 */
	on<T>(type: string, listener: EventedListenerOrArray<T, EventTargettedObject<T>>): Handle;
}

/**
 * Evented options interface
 */
export interface EventedOptions {
	listeners?: EventedListenersMap<any>;
}

export interface EventedCallback<E extends EventObject> {
	/**
	 * A callback that takes an `event` argument
	 *
	 * @param event The event object
	 */
	(event: E): boolean | void;
}

/**
 * Either an EventedCallback or an Actionable, which are valid listeners for Evented events
 */
export type EventedListener<T, E extends EventTargettedObject<T>> = EventedCallback<E> | Actionable<T, E>;

/**
 * A map of listeners to be applied, where the key of the map is the `event.type` to listen for
 */
export interface EventedListenersMap<T> {
	[type: string]: EventedListenerOrArray<T, EventTargettedObject<T>>;
}

/**
 * A type which is either a targeted event listener or an array of listeners
 * @template T The type of target for the events
 * @template E The event type for the events
 */
export type EventedListenerOrArray<T, E extends EventTargettedObject<T>> = EventedListener<T, E> | EventedListener<T, E>[];

export interface StateChangeEvent<S extends Object, T extends Stateful<S>> extends EventTypedObject<'state:changed'> {
	/**
	 * The state of the target
	 */
	state: S;

	/**
	 * A Stateful instance
	 */
	target: T;
}

export interface StateInitalizedEvent<S extends Object, T extends Stateful<S>> extends EventTypedObject<'state:initialized'> {
	/**
	 * The state of the target
	 */
	state: S;

	/**
	 * A Stateful instance
	 */
	target: T;
}

export type Stateful<S extends Object> = StatefulMixin<S> & Evented & {
	/**
	 * Add a listener for a `state:changed` event, which occurs whenever the state changes on the instance.
	 *
	 * @param type The event type to listen for
	 * @param listener The listener that will be called when the event occurs
	 */
	on(type: 'state:changed', listener: EventedListener<Stateful<S>, StateChangeEvent<S, Stateful<S>>>): Handle;

	/**
	 * Add a listener for a `state:completed` event, which occurs when state is observed
	 * and is completed.  If the event is not cancelled, the instance will continue and
	 * call `target.destroy()`.
	 *
	 * @param type The event type to listen for
	 * @param listener The listener that will be called when the event occurs
	 */
	on(type: 'state:completed', listener: EventedListener<Stateful<S>, EventCancelableObject<'state:completed', Stateful<S>>>): Handle;

	/**
	 * Add a listener for a `state:initialized` event, which occurs when state Statful has finished fully setting up
	 * `instance.state` during creation.  This will always occur out of turn (asnyc) from the creation cycle, to ensure
	 * that listeners can be attached during initialization.
	 *
	 * @param type The event type to listen for
	 * @param listener The listener that will be called when the event occurs
	 */
	on(type: 'state:initialized', listener: EventedListener<Stateful<S>, StateInitalizedEvent<S, Stateful<S>>>): Handle;
}

export interface StatefulMixin<S extends Object> {
	/**
	 * A state of the instannce
	 */
	state: S | undefined;

	/**
	 * A readonly reference to the stateFrom provided to the widget on instantiation.
	 */
	readonly stateFrom: StoreObservablePatchable<S> | undefined;

	/**
	 * Observe (and update) the state from an Observable
	 * @param id The ID to be observed on the Observable
	 * @param observable An object which provides a `observe` and `patch` methods which allow `Stateful` to be able to
	 *                   manage its state.
	 */
	observeState(id: string, observable: StoreObservablePatchable<S>): Handle;
}

/**
 * Options for a stateful object
 */
export interface StatefulOptions<S extends Object> extends EventedOptions {

	/**
	 * id of the stateful object when using `StoreObservablePatchable`.
	 */
	id?: string;

	/**
	 * The `StoreObservablePatchable` used to back state.
	 */
	stateFrom?: StoreObservablePatchable<S>;
}
