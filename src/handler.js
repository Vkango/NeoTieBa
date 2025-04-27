export class KeepAliveHandler {
  constructor() {
    this._ = {};
  }

  get keys() {
    const { cache } = this._
    if (!cache || !cache()) {
      return [];
    }
    return [...cache().keys()];
  }

  //绑定keepAlive信息
  bind(keepAlive) {
    if (keepAlive && keepAlive.$.__v_cache) {
      const sharedContext = keepAlive.$.ctx;
      const instance = keepAlive.$;
      const { suspense: parentSuspense, __v_cache: cache } = instance;
      const {
        renderer: { um: unmount },
      } = sharedContext;

      Object.assign(this._, {
        cache() {
          return cache;
        },
        unmount(vnode) {
          if (vnode.component?.isUnmounted) {
            vnode.component.unmounted();
          }
          resetShapeFlag(vnode);
          unmount(vnode, instance, parentSuspense, true);
        },
        isCurrent(key) {
          return keepAlive.$.subTree && keepAlive.$.subTree.key === key
        }
      });
    } else {
      console.warn('KeepAlive binding failed: invalid keepAlive reference')
    }
  }

  remove(key, reset = true) {
    const { cache } = this._;
    if (!cache || !cache()) return false;
    const vnode = cache().get(key);
    if (vnode?.component) {
      if (vnode.component.subTree) {
        if (typeof vnode.component.proxy?.cleanup === 'function') {
          vnode.component.proxy.cleanup();
        }
        if (typeof vnode.component.proxy?.beforeUnmount === 'function') {
          vnode.component.proxy.beforeUnmount();
        }
      }
    }

    const result = pruneCache.call(this, k => key !== k, reset);

    if (result && typeof window.gc === 'function') {
      window.gc();
    }
    return result;
  }
  //清空
  clear() {
    pruneCache.call(this, () => false, false)
  }
}

function pruneCache(filter, reset) {
  const { cache, unmount, isCurrent } = this._
  if (!cache || !cache()) {
    return false;
  }
  const c = cache()
  let removed = false;
  c.set = new Map().set
  c.forEach((vnode, key) => {
    if (!filter(key)) {
      removed = true;
      if (isCurrent(key)) {
        if (reset) {
          c.set = function () {
            c.set = new Map().set
          }
        }
        resetShapeFlag(vnode)
      } else {
        unmount(vnode);
      }
      c.delete(key);
    }
  });
  return removed;
}

function resetShapeFlag(vnode) {
  let shapeFlag = vnode.shapeFlag;
  if (shapeFlag & 256) {
    shapeFlag -= 256;
  }
  if (shapeFlag & 512) {
    shapeFlag -= 512;
  }
  vnode.shapeFlag = shapeFlag;
}