export interface SkeletalItem {
    name: string
    path: string
    code: string
    gender: 'female' | 'male'
    preview: string
}

export type SkeletalConfig = Record<string, SkeletalItem[]>

export const Skeletal: SkeletalConfig = {
    Feet: [
        {
            name: '女乞丐鞋',
            path: `/Script/Engine.SkeletalMesh'/DasAssetLibrary/G2_WulinSwordman_01/Meshes/Characters/Seperates/Females/SK_ShoesBeggar.SK_ShoesBeggar'`,
            code: 'Feet_001',
            gender: 'female',
            preview: '/images/female_suit_1.png'
        },
        {
            name: '男乞丐鞋',
            path: `/Script/Engine.SkeletalMesh'/DasAssetLibrary/G2_WulinSwordman_01/Meshes/Characters/Seperates/Males/SK_MShoesBeggar.SK_MShoesBeggar'`,
            code: 'Feet_002',
            gender: 'male',
            preview: '/images/male_suit_1.png'
        }
    ],
    Hair: [
        {
            name: '斗笠',
            path: `/Script/Engine.SkeletalMesh'/DasAssetLibrary/G2_WulinSwordman_01/Meshes/Characters/Seperates/Females/SK_BambooHat_B.SK_BambooHat_B'`,
            code: 'Hair_001',
            gender: 'female',
            preview: '/images/female_suit_2.png'
        },
        {
            name: '男斗笠',
            path: `/Script/Engine.SkeletalMesh'/DasAssetLibrary/G2_WulinSwordman_01/Meshes/Characters/Seperates/Males/SK_MBambooHat_B.SK_MBambooHat_B'`,
            code: 'Hair_002',
            gender: 'male',
            preview: '/images/male_suit_2.png'
        }
    ],
    HandL: [
        {
            name: '乞丐手套左',
            path: `/Script/Engine.SkeletalMesh'/DasAssetLibrary/G2_WulinSwordman_01/Meshes/Characters/Seperates/Females/SK_GloveBeggar_L.SK_GloveBeggar_L'`,
            code: 'HandL_001',
            gender: 'female',
            preview: '/images/female_suit_1.png'
        },
        {
            name: '男乞丐手套左',
            path: `/Script/Engine.SkeletalMesh'/DasAssetLibrary/G2_WulinSwordman_01/Meshes/Characters/Seperates/Males/SK_MGloveBeggar_L.SK_MGloveBeggar_L'`,
            code: 'HandL_002',
            gender: 'male',
            preview: '/images/male_suit_1.png'
        }
    ],
    HandR: [
        {
            name: '乞丐手套右',
            path: `/Script/Engine.SkeletalMesh'/DasAssetLibrary/G2_WulinSwordman_01/Meshes/Characters/Seperates/Females/SK_GloveBeggar_R.SK_GloveBeggar_R'`,
            code: 'HandR_001',
            gender: 'female',
            preview: '/images/female_suit_1.png'
        },
        {
            name: '男乞丐手套右',
            path: `/Script/Engine.SkeletalMesh'/DasAssetLibrary/G2_WulinSwordman_01/Meshes/Characters/Seperates/Males/SK_MGloveBeggar_R.SK_MGloveBeggar_R'`,
            code: 'HandR_002',
            gender: 'male',
            preview: '/images/male_suit_1.png'
        }
    ],
    BottomBody: [
        {
            name: '士兵裤黑',
            path: `/Script/Engine.SkeletalMesh'/DasAssetLibrary/G2_WulinSwordman_01/Meshes/Characters/Seperates/Females/SK_BottomBody_C.SK_BottomBody_C'`,
            code: 'BottomBody_001',
            gender: 'female',
            preview: '/images/female_suit_2.png'
        },
        {
            name: '男下装C',
            path: `/Script/Engine.SkeletalMesh'/DasAssetLibrary/G2_WulinSwordman_01/Meshes/Characters/Seperates/Males/SK_MBottomBody_C.SK_MBottomBody_C'`,
            code: 'BottomBody_002',
            gender: 'male',
            preview: '/images/male_suit_2.png'
        }
    ],
    UpperBody: [
        {
            name: '女上衣C2',
            path: `/Script/Engine.SkeletalMesh'/DasAssetLibrary/G2_WulinSwordman_01/Meshes/Characters/Seperates/Females/SK_UpperBody_C2.SK_UpperBody_C2'`,
            code: 'UpperBody_001',
            gender: 'female',
            preview: '/images/female_suit_2.png'
        },
        {
            name: '男上衣C2',
            path: `/Script/Engine.SkeletalMesh'/DasAssetLibrary/G2_WulinSwordman_01/Meshes/Characters/Seperates/Males/SK_MUpperBody_C2.SK_MUpperBody_C2'`,
            code: 'UpperBody_002',
            gender: 'male',
            preview: '/images/male_suit_2.png'
        }
    ]
}
