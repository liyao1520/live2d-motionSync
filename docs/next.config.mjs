import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  agentRules: false,
  transpilePackages: ['@live2d-motionsync/core'],
};

export default withMDX(config);
