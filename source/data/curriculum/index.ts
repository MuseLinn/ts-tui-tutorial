import type {Lesson} from '../../data/types.js';
import {lesson01Variables} from './stage1/01-variables.js';
import {lesson02Operators} from './stage1/02-operators.js';
import {lesson03Functions} from './stage1/03-functions.js';
import {lesson04Conditionals} from './stage1/04-conditionals.js';
import {lesson05Loops} from './stage1/05-loops.js';
import {lesson06Arrays} from './stage1/06-arrays.js';
import {lesson07Objects} from './stage1/07-objects.js';
import {lesson08Interface} from './stage1/08-interface.js';
import {lesson09OptionalProperties} from './stage1/09-optional-properties.js';
import {lesson10TypeAlias} from './stage1/10-type-alias.js';
import {lesson11AnyVsUnknown} from './stage1/11-any-vs-unknown.js';
import {lesson12Stage1Review} from './stage1/12-stage1-review.js';

export const curriculum: Lesson[] = [
	lesson01Variables,
	lesson02Operators,
	lesson03Functions,
	lesson04Conditionals,
	lesson05Loops,
	lesson06Arrays,
	lesson07Objects,
	lesson08Interface,
	lesson09OptionalProperties,
	lesson10TypeAlias,
	lesson11AnyVsUnknown,
	lesson12Stage1Review,
];
