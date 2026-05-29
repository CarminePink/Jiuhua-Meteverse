export enum ChapterEnum {
    'HuaChengSi' = 0,
    'YueShenDian' = 1,
    'BaiSuiGong' = 2,
    'QiYuanSi' = 3
}

export const ChapterInfo = {
    [ChapterEnum.HuaChengSi]: {
        missionTarget:
            '金地藏曾于石屋中闭目端坐，身旁伴有一折足之鼎。请寻找这件重要的宝物，见当年修行之迹。',
        missionClue: '一折足之鼎。'
    },
    [ChapterEnum.YueShenDian]: {
        missionTarget: '请寻找那能听三界、辨真伪的护法神兽。',
        missionClue: '它的相貌独特，集众兽之像于一身，有独角、犬耳、龙身、虎头、狮尾、麒麟足。'
    },
    [ChapterEnum.BaiSuiGong]: {
        missionTarget:
            '这段高僧大愿的见证皆凝聚在《大方广佛华严经》之中，请寻找由无暇禅师的《大方广佛华严经》吧！',
        missionClue:
            '一片泛黄的纸本，相传，那是用舌血调和银珠书写而成，历经四百余年，依然色泽如新。'
    },
    [ChapterEnum.QiYuanSi]: {
        missionTarget: '请前往寺院里，寻找传说中的大铜锅。',
        missionClue: '一口大锅，直径为三位数'
    }
}
