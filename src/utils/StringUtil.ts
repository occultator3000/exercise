export function formaPhone(phone:string):string{
    let trim:string = phone.replace(/\D/g, '');//不能用phone.trim(),因为它只去掉前后空格，中间在setPhone输入过程中会不断插入空格导致格式错误
    const result = [
        trim.slice(0,3),
        trim.slice(3,7),
        trim.slice(7,11)
    ].filter(item=>!!item).join(' ');
    return result;
}

export function replaceBlank(phone:string):string{
    return phone ? phone.replace(/\s+/g, '') : '';
}