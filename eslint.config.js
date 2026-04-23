import globals from "globals";

export default [
    {
        files: ["**/*.js"],
        languageOptions: {
            sourceType: "module",
            globals: {
                ...globals.browser, // Це автоматично додасть setTimeout, requestAnimationFrame, window тощо.
            }
        },
        rules: {
            "no-unused-vars": "warn",
            "no-undef": "error"
        }
    }
];