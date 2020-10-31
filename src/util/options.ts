export default function getOption<T>(prop: string, defaultValue: T, options?: any): T {
  // If options is defined,
  //   check if the property exists
  //       if so, return the value
  //       else use the default value provides
  //   if not, use the default value
  // return the default value if the options object doesn't exist
  return options ? options.hasOwnProperty(prop) ? options[prop]! : defaultValue : defaultValue;
}
