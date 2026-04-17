declare module "*.css" {
  const content: { [key: string]: string } | string;
  export default content;
}
