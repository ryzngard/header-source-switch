//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as myExtension from '../src/extension';
import { FileMapping, findMatchedFileAsync } from '../src/fileOperations';
import * as fs from 'fs';
import * as path from 'path';

const workspacePath = path.resolve(__dirname, '../../test-workspace');

// Defines a Mocha test suite to group tests of similar kind together
suite("Find Matching", () => {

    // Defines a Mocha unit test
    test("h/cpp", async () => {
        await testFoundFile('test.h', 'test.cpp');
    });
    test('h/c', async () => {
        await testFoundFile('test.h', 'test.c');
    });
    test('h/cc', async () => {
        await testFoundFile('test.h', 'test.cc');
    });
    test('h/cxx', async () => {
        await testFoundFile('test.h', 'test.cxx');
    });
    test('h/mm', async () => {
        await testFoundFile('test.h', 'test.mm');
    });
    test("hpp/cpp", async () => {
        await testFoundFile('test.hpp', 'test.cpp');
    });
    test('hpp/c', async () => {
        await testFoundFile('test.hpp', 'test.c');
    });
    test('hpp/cc', async () => {
        await testFoundFile('test.hpp', 'test.cc');
    });
    test('hpp/cxx', async () => {
        await testFoundFile('test.hpp', 'test.cxx');
    });
    test('hpp/mm', async () => {
        await testFoundFile('test.hpp', 'test.mm');
    });
    test("hh/cpp", async () => {
        await testFoundFile('test.hh', 'test.cpp');
    });
    test('hh/c', async () => {
        await testFoundFile('test.hh', 'test.c');
    });
    test('hh/cc', async () => {
        await testFoundFile('test.hh', 'test.cc');
    });
    test('hh/cxx', async () => {
        await testFoundFile('test.hh', 'test.cxx');
    });
    test('hh/mm', async () => {
        await testFoundFile('test.hh', 'test.mm');
    });
    test("hx/cpp", async () => {
        await testFoundFile('test.hx', 'test.cpp');
    });
    test('hx/c', async () => {
        await testFoundFile('test.hx', 'test.c');
    });
    test('hx/cc', async () => {
        await testFoundFile('test.hx', 'test.cc');
    });
    test('hx/cxx', async () => {
        await testFoundFile('test.hx', 'test.cxx');
    });
    test('hx/mm', async () => {
        await testFoundFile('test.hx', 'test.mm');
    });
});

async function testFoundFile(header: string, source: string) {
    let headerPath = path.join(workspacePath, header);
    let sourcePath = path.join(workspacePath, source);

    let mappings: FileMapping[] = [
        {
            header: [path.extname(header)],
            source: [path.extname(source)],
            name: 'Test Mapping'
        }
    ]

    let match = await findMatchedFileAsync(headerPath, mappings);
    assert.strictEqual(match, sourcePath);

    match = await findMatchedFileAsync(sourcePath, mappings);
    assert.strictEqual(match, headerPath);
}
