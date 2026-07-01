// Holds equipment data for the frontend

// Defines the structure and asset paths for any equipment item
interface EquipmentItem {
    id: string;
    name: string;
    thumbnail: string;
    meshTypeBoth: string;
    meshType1: string;
    meshType2: string;
}

// Equipment registry organized by slot type
const equipmentData: Record<string, EquipmentItem[]> = {
    helmet: [
        {
            id: 'elven',
            name: 'Elven',
            thumbnail: '/assets/icons/arelith/helmet/helmet-elven.svg',
            meshTypeBoth: 'helmetElvenTypeBoth',
            meshType1: 'helmetElvenType1',
            meshType2: 'helmetElvenType2'
        },
        {
            id: 'gladiator',
            name: 'Gladiator',
            thumbnail: '/assets/icons/arelith/helmet/helmet-gladiator.svg',
            meshTypeBoth: 'helmetGladiatorTypeBoth',
            meshType1: 'helmetGladiatorType1',
            meshType2: 'helmetGladiatorType2'
        }
    ],
    neck: [],
    chest: [],
    belt: [],
    pelvis: [],
    robe: [],
    cloak: [],
    leftShoulder: [],
    rightShoulder: [],
    leftBicep: [],
    rightBicep: [],
    leftForearm: [],
    rightForearm: [],
    leftHand: [],
    rightHand: [],
    leftThigh: [],
    rightThigh: [],
    leftShin: [],
    rightShin: [],
    leftFoot: [],
    rightFoot: []
}

export { equipmentData };
export type { EquipmentItem };
