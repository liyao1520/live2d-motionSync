import Editor from "@/components/Editor";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";

const myComponents = {
  ...defaultMdxComponents,
  Editor,
};

// use this function to get MDX components, you will need it for rendering MDX
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...myComponents,
    ...components,
  };
}

declare global {
  type MDXProvidedComponents = typeof myComponents;
}
