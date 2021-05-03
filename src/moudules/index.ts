import room from './room/index'


export const  moudules = () => {
    if (!Memory.rooms) Memory.rooms = {}
    else delete Memory.rooms.undefined

    room()
}
