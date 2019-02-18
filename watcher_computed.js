
//响应式原理  vue通过Obejct.defineProperty方法把data对象的每一个属性转化为getter/setter，
//当属性被修改和访问时通知变化
//一、响应式

function defineReactive(obj,key,val) {
    Object.defineProperty(obj,key,{
        get(){
            console.log(`我的${key}被读取了`);
            return val;
        },
        set(newVal) {
            console.log(`我的${key}被修改了`);
            val = newVal
        }
    })
}


//将每一个对象转换为可观测对象
function observable(obj) {
    const keys = Object.keys(obj);

    keys.forEach((key)=> {
        defineReactive(obj,key,obj[key])
    })

    return obj
}


//对象定义
const person = observable({
    healthy: 5000,
    IQ: 200
})


//二、计算属性
function onComputedUpdate(val) {
    console.log(`我的类型是：${val}`);
}

function watcher(obj,jey,cb) {
    Object.defineProperty(obj,key,{
        get() {
            const val = cb();
            onComputedUpdate(val);
            return val
        },
        set() {
            console.error(`计算属性无法被赋值！`);
        }
    })
}

watcher(person,'type',()=> {
    return person.healthy > 5000 ?'健康' : '亚健康'
})










