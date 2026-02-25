import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

const config = {
    stories: [
        "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
        "../components/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    ],
    addons: ["@storybook/addon-links"],
    framework: {
        name: "@storybook/react",
        options: {},
    },
    core: {
        builder: "@storybook/builder-webpack5",
    },
    webpackFinal: async (baseConfig: any) => {
        baseConfig.resolve ??= {};
        baseConfig.resolve.alias = {
            ...(baseConfig.resolve.alias ?? {}),
            "@": path.resolve(__dirname, ".."),
        };
        baseConfig.resolve.extensions = [
            ...(baseConfig.resolve.extensions ?? []),
            ".ts",
            ".tsx",
        ];

        baseConfig.module ??= { rules: [] };
        baseConfig.module.rules = [
            ...(baseConfig.module.rules ?? []),
            {
                test: /\.(ts|tsx)$/,
                use: [
                    {
                        loader: require.resolve("babel-loader"),
                        options: {
                            presets: [
                                require.resolve("@babel/preset-env"),
                                [
                                    require.resolve("@babel/preset-react"),
                                    { runtime: "automatic" },
                                ],
                                require.resolve("@babel/preset-typescript"),
                            ],
                        },
                    },
                ],
                exclude: /node_modules/,
            },
        ];

        return baseConfig;
    },
    staticDirs: ["../public"],
};

export default config;
