import AsyncStorage from "@react-native-async-storage/async-storage";   
//封装四种数据存储方法
const save =async(key:string,value:string)=>{
    try{
        return await AsyncStorage.setItem(key,value);
    }catch(e){
        console.error("Error saving data", e);
    }
}

const load =async(key:string)=>{
    try{
        return await AsyncStorage.getItem(key);
    }catch (e){
        console.error("Error loading data", e);
        return null;
    }
}

const remove =async(key:string)=>{
    try{
        return await AsyncStorage.removeItem(key);
    }catch(e){
        console.error("Error removing data", e);
    }
}

const clear =async()=>{
    try{
        return await AsyncStorage.clear();
    }catch(e){
        console.error("Error clearing storage", e);
    }
}