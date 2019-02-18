class Dep {
    constructor() {
        this.deps = []
    }

    depend () {
        if(Dep.target && this.deps.indexOf(Dep.target) === -1){
            this.deps.push(Dep.target)
        }
    }

    notify () {
        this.deps.forEach((dep) => {
            dep()
        })
    }
}

Dep.target = null;


class Observable {
    constructor(obj) {
        return this.walk(obj)
    }

    walk (obj) {
        const keys = Object.keys(obj);
        keys.forEach((key)=> {
            this.defineReactive(obj,key,obj[key])
        })
        return obj
    }

    defineReactive (obj,key,val) {
        const dep = new Dep()
        Object.defineProperty(obj,key,{
            get() {
                dep.depend()
                return val
            },
            set (newVal) {
                val = newVal
                dep.notify()
            } 
        })
    }
}


class Watcher {
    constructor (obj,key,cb, onComputedUpdate) {
        this.obj = obj
        this.key = key
        this.cb = cb
        this.onComputedUpdate = onComputedUpdate
        return this.defiineComputed()
    }

    defiineComputed() {
        const self = this
        const onDepUpdated = () => {
            const val = self.cb()
            this.onComputedUpdate(val)
        }

        Object.defineProperty(self.obj,self.key,{
            get () {
                Dep.target = onDepUpdated
                const val = self.cb()
                Dep.target = null
                return val
            },
            set () {
                console.error(`计算属性无法被赋值！`)
            }
        })
    }
}


//测试

const person = new Observable({
    health: 5000,
    IQ: 200
})

new Watcher(person, 'type', ()=> {
    return person.health > 4500 ? '健康' : '亚健康' 
},(val)=> {
    console.log(`我的类型时${val}`);
})

console.log(`初始健康状态为：${person.type}`)
person.health = 3000;
