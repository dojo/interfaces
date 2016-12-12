import { includes } from 'dojo-shim/array';
import TypeWriter, { TypeWriterResult } from './TypeWriter';
import {
	createCompilerHost,
	createProgram,
	CompilerOptions,
	ModuleKind,
	ScriptTarget
} from 'typescript';

/**
 * Thenable represents any object with a callable `then` property.
 */
export interface Thenable<T> {
	then<U>(onFulfilled?: (value?: T) => U | Thenable<U>, onRejected?: (error?: any) => U | Thenable<U>): Thenable<U>;
}

export function isEventuallyRejected<T>(promise: Thenable<T>): Thenable<boolean> {
	return promise.then<any>(function () {
		throw new Error('unexpected code path');
	}, function () {
		return true; // expect rejection
	});
}

export function throwImmediatly() {
	throw new Error('unexpected code path');
}

export interface TypesForFiles {
	[filename: string]: TypeWriterResult[];
}

/**
 * A function which returns a map of arrays representing the types for each file
 *
 * @param fileNames The file names to generate the types for
 */
export function getTypeForFiles(...fileNames: string[]): TypesForFiles {
	const compilerOptions: CompilerOptions = {
		module: ModuleKind.CommonJS,
		target: ScriptTarget.ES2015
	};
	const host = createCompilerHost(compilerOptions);
	const program = createProgram(fileNames, compilerOptions, host);
	const typeWriter = new TypeWriter(program, false);
	const results: TypesForFiles = {};
	program.getSourceFiles().forEach((sourceFile) => {
		if (includes(fileNames, sourceFile.fileName)) {
			results[sourceFile.fileName] = typeWriter.getTypeAndSymbols(sourceFile.fileName);
		}
	});
	return results;
}
