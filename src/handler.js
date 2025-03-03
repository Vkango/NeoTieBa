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
            resetShapeFlag(vnode);
            unmount(vnode, instance, parentSuspense, true);
          },
          isCurrent(key) {
            return keepAlive.$.subTree && keepAlive.$.subTree.key === key
          }
        });
      } else {
        console.warn('当且仅当开发环境或者启用了devtool时生效')
      }
    }
  
    //删除指定key的缓存
    remove(key, reset = true) {
      pruneCache.call(this, k => key !== k, reset)
    }
    //清空
    clear() {
      pruneCache.call(this, () => false, false)
    }
  }
  
  function pruneCache(filter, reset) {
    const { cache, unmount, isCurrent } = this._
    if (!cache || !cache()) {
      return
    }
    const c = cache()
    c.set = new Map().set
    c.forEach((vnode, key) => {
      if (!filter(key)) {
        if (isCurrent(key)) {
          //重写set，因为渲染函数可能会重新执行
          //这样就会导致缓存重新添加，导致清除失败
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