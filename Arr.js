function concat(){
    const arr1=[1,2,3]
    const arr2=[4,5]
    const arr3=arr1.concat(arr2)
    console.log(arr1)
    console.log(arr3)
}
function join(){
    const arr=[2,3,4]
    console.log(arr.join())
    console.log(arr)
}
function push(){
    const a=[2,3,4]
    const b=a.push(5)
    console.log(a)
    console.log(b)
}
function pop(){
    const arr=[2,3,4]
    console.log(arr.pop())
    console.log(arr)
}
function shift(){
    const arr=[2,3,4]
    console.log(arr.shift())
    console.log(arr)
}
function unshift(){
    const arr=[2,3,4,5]
    console.log(arr.unshift(3,6))
    console.log(arr)
}
function slice(){
    const arr=[2,3,4,5]
    console.log(arr.slice(1,3))
    console.log(arr)
}
function splice(){
    const a=[5,6,7,8]
    console.log(a.splice(1,0,9))
    console.log(a)
    const b=[5,6,7,8]
    console.log(b.splice(1,2,3))
    console.log(b)
}
function substr(){
    const str='1234567890'
    console.log(str.substr(2))
    console.log(str.substr(2,5))
}
function substring(){
    const str='1234567890'
    console.log(str.substring(2))
    console.log(str.substring(2,5))
}
function sort(){
    const fruit=['cherries','apples','bananas']
    console.log(fruit.sort())
    const scores=[1,10,21,2]
    console.log(scores.sort())
}
function reverse(){
    const arr=[2,3,4]
    console.log(arr.reverse())
    console.log(arr)
}
function indexOf(){
    const a=[2,9,9]
    console.log(a.indexOf(2))
    console.log(a.indexOf(7))
}
function lastIndexOf(){
    const numbers=[2,5,9,2]
    console.log(numbers.lastIndexOf(2))
    console.log(numbers.lastIndexOf(7))
    console.log(numbers.lastIndexOf(2,3))
    console.log(numbers.lastIndexOf(2,2))
    console.log(numbers.lastIndexOf(2,-2))
    console.log(numbers.lastIndexOf(2,-1))
}
function every(){
    function en(element,index,array){
        console.log(element<10)
    }
    const arr=[2,5,8,3,4]
    arr.every(en)
}
function some(){
    function en(element,index,array){
        return element>10
    }
    const arr1=[2,5,8,1,4]
    const arr2=[12,5,8,1,4]
    arr1.some(en)
    arr2.some(en)
}
function filter(){
    const words=['spray','limit','elite','exuberant','destruction','present','happy']
    const longw=words.filter(function(word){
        return word.length>6
    })
    console.log(longw)
}
function map(){
    const numbers=[1,5,10,15]
    const doubles=numbers.map(function(x){
        return x*2
    })
    console.log(doubles)
}
function forEach(){
    const items=['item1','item2','item3']
    const copy=[]
    items.forEach(function(item){
        copy.push(item)
    })
}
//es6

function find(){
    const arr=[1,'2',3,3,'2']
    console.log(arr.find(n=>typeof n==='number'))
}
function findIndex(){
    const arr=[1,'2',3,3,'2']
    console.log(arr.findIndex(n=>typeof n==='number'))
}
function fill(){
    const arr=[1,2,3,4,5,6]
    arr.fill(0,1,4)
}
function copyWithin(){
    const arr = [1,2,3,4,5]
    console.log(arr.copyWithin(3))
    const arr1=[1,2,3,4,5]
    console.log(arr1.copyWithin(3,1))
    const arr2=[1,2,3,4,5]
    console.log(arr2.copyWithin(3,1,2))
}
function from(){
    const bar=['a','b','c']
    Array.from(bar)
    Array.from('foo')
}
function of(){
    Array.of(7)
    Array.of(1,2,3)
    Array(7)
    Array(1,2,3)
}
function entries(){
    const arr1=['a','b','c']
    for(let v of arr1.entries()){
        console.log(v)
    }
    const arr2=new Set(['a','b','c'])
    for(let v of arr2.entries()){
        console.log(v)
    }
    const arr3=new Map()
    arr3.set('a','a')
    arr3.set('b','b')
    for(let v of arr3.entries()){
        console.log(v)
    }
}
function values(){
    const arr1=['a','b','c']
    for(let v of arr1.values()){
        console.log(v)
    }
    const arr2=new Set(['a','b','c'])
    for(let v of arr2.values()){
        console.log(v)
    }
    const arr3=new Map()
    arr3.set('a','a')
    arr3.set('b','b')
    for(let v of arr3.values()){
        console.log(v)
    }
}
function keys(){
    const arr1=['a','b','c']
    for(let v of arr1.keys()){
        console.log(v)
    }
    const arr2=new Set(['a','b','c'])
    for(let v of arr2.keys()){
        console.log(v)
    }
    const arr3=new Map()
    arr3.set('a','a')
    arr3.set('b','b')
    for(let v of arr3.keys()){
        console.log(v)
    }
}
function includes(){
    const a=[1,2,3]
    a.includes(2)
    a.includes(4)
}
