//vue依赖收集原理
const Dep = {
    target: null//存放监听器里面的 onComputedUpdate方法
}

//把一个对象的每一项转换为可观测对象
function observable(obj) {
    const keys = Object.keys(obj);
    for(let i=0; i< keys.length; i++){
        defineReactive(obj,keys[i],obj[key[i]])
    }
    return obj
}

//当计算属性的值被更新时调用
function onComputedUpdate(val) {
    console.log(`我的类型是：${val}`);
}


//观测者
function watcher(obj,key,cb) {

    //被动调用函数，当这个‘被检测对象’的依赖更新时调用
    const onDepUpdated = ()=> {
        const val = cb();
        onComputedUpdate(val)
    }

    Object.defineProperty(obj,key,{
        get() {
            Dep.target = onDepUpdated
            //执行cb()的过程中会用到Dep.target,
            //当cb()执行完了就重置Dep.target为null
            const val = cb();
            Dep.target = null;
            return val;
        },
        set () {
            console.error(`计算属性无法被赋值！`)
        }
    })
}

function defineReactive(obj,key,val) {
    const deps = [];
    Object.defineProperty(obj,key,{
        get() {
            if(Dep.target && deps.indexOf(Dep.target) === -1){
                deps.push(Dep.target);//Dep.taraget等于监听器得onComputedUpdate()方法，这个时候，可观测对象已经和监听器捆绑到一块了
            }

            return val;
        },
        set(newVal) {
            val = newVal;
            deps.forEach((dep)=> {
                dep()
            })
        }
    })
}


const person = observable({
    health: 3500,
    IQ: 200
})

const watcher(person,'type',()=> {
    return person.health > 4000 ? '健康' : '亚健康'
})

console.log(`健康初始状态：${person.type}`);

person.health = 5000;
