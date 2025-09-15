export function isClient() {
  return typeof window !== 'undefined';
}

export function logger(isDebug: boolean) {
  return (message: string, ...args: any[]) => {
    if (!isDebug) {
      return;
    }

    console.log('%c[BundleUp]', 'color: #00f;', message, ...args);
  };
}

export function isTrue(val?: string) {
  if (!val) {
    return false;
  }

  return val.toLowerCase() === 'true';
}