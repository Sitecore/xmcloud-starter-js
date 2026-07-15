// Mock component-map to prevent circular dependencies in tests
// This file is used by Jest to mock the .sitecore/component-map module
const componentMap = new Map<string, unknown>();

export default componentMap;
