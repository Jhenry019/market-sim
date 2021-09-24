module.exports = {
  roots: ["<rootDir>/src"],
  setupFilesAfterEnv: [
    "@testing-library/jest-dom/extend-expect"
  ],
  moduleNameMapper: {
    "\\.(css|scss)$": "identity-obj-proxy"
  },
  testEnvironment: "jsdom"
};