const staticResourceUrl = (window.webConfig as any).staticResourceUrl || ''
const normalizePath = (path: string) => path.replace(/\\/g, '/').replace(/\/$/, '')
const markerBasePath = normalizePath((window.webConfig as any).mapMarkerUrl || '')

/**
 * @param {number}   shapes[].dRadius      - 水平半径（米）
 * @param {number}   shapes[].dHeightAdd   - 向上高度范围（米）
 * @param {number}   shapes[].dHeightReduce - 向下高度范围（米）
 */
export const chapter2TriggerPoints = [
    {
        // 月身殿山门触发点
        id: 'trigger1',
        name: '月身殿山门',
        position: [117.79316667443317, 30.4784702926314, 666.8421795563605],
        dRadius: 1,
        dHeightAdd: 0.5,
        dHeightReduce: 0.5
    },
    {
        // 月身殿NPC触发点
        id: 'trigger2',
        name: '月身殿NPC',
        position: [117.79297718737239, 30.47921774855789, 682.1713118966359],
        dRadius: 1,
        dHeightAdd: 0.5,
        dHeightReduce: 0.5
    }
]

// 剧情介绍
export const chapter2IntroOne = [
    {
        id: 1,
        text: '唐贞元十年（794年），金地藏圆寂，最初只建了三层石筑浮屠供奉其肉身。到了宋代开始修建塔院，并在塔的周围修建了一座七层八角的木质宝塔。明代以后，殿宇渐次增建，渐成规模，形成“殿内有塔、塔外有殿”的罕见形制。经千载风雨，历世代修葺，才有了如今眼前这般层阁重廊、气象恢弘的九华圣地月身殿建筑群。',
        audio: `/audio/chapter2/plotInfo/chapter2_intro_one.mp3`,
        duration: 38
    }
]

// 宝藏介绍
export const chapter2TreasureIntro = [
    {
        id: 1,
        text: '恭喜寻得‘谛听’！谛听原身是一条白犬，随唐代新罗僧人金乔觉（后被尊为地藏菩萨）涉海西发，乘风破浪，径往大唐，求法修道。最终历经艰辛，来到九华山，成了他卓锡修行的理想之地。金地藏在九华山修行期间，白犬昼夜相随，攻读佛经，言传身教，亲率弟子开渠引水，垦荒种田。金乔觉圆寂后，白犬也随之傍息，后人将其尊为地藏菩萨的护法神兽，被视为吉祥之物。',
        audio: `/audio/chapter2/treasure/chapter2_treasure_1.mp3`,
        duration: 37
    }
]

export const dialogueOne = [
    {
        id: 1,
        text: '施主远道而来，可是专程来寻金地藏的足迹？',
        audio: `/audio/chapter2/chapter2_one_1.mp3`,
        duration: 4
    },
    {
        id: 2,
        type: 'answer',
        text: '大师一生慈悲普度。欲知前世因缘，不妨去问问那能听三界、辨真伪的护法神兽吧！它耳中自有你要的故事。',
        audio: `/audio/chapter2/chapter2_one_2.mp3`,
        duration: 11
    },
    {
        id: 3,
        type: 'answer',
        text: '但这神兽，忠诚机敏，不遇有缘人不现身。你若能通过我的考验，便告诉你它的藏身之处。',
        audio: `/audio/chapter2/chapter2_one_3.mp3`,
        duration: 9
    }
]

export const dialogueTwo = [
    {
        id: 1,
        type: 'answer_pass',
        text: '善哉。施主果然有缘。这护法神兽相貌独特，长有独角、犬耳、龙身、虎头、狮尾、麒麟足，集群兽之像于一身。去吧，它就在这寺院中。寻得此兽后，再来此处找我吧。',
        audio: `/audio/chapter2/chapter2_two_1.mp3`,
        duration: 21
    }
]

export const dialogueThree = [
    {
        id: 1,
        text: '来了？看来你是找到它了。那我也该把后面的故事说给你听了。',
        audio: `/audio/chapter2/chapter2_three_1.mp3`,
        duration: 6
    },
    {
        id: 2,
        text: '这位渡海而来的异国僧呀，在他圆寂的那天，山中鸟兽哀鸣。三年后，弟子开缸，见颜面如生，因其容貌与地藏菩萨酷似，遂认定为地藏菩萨示现。因其俗姓金，尊为金地藏。从此以后，九华山就成了世人心中最神圣的道场。',
        audio: `/audio/chapter2/chapter2_three_2.mp3`,
        duration: 25
    },
    {
        id: 3,
        text: '千百年来，无数僧侣与信众从四面八方而来，沿着山间古道，一步一步徒步而上，只为心中那份虔诚与信仰。',
        audio: `/audio/chapter2/chapter2_three_3.mp3`,
        duration: 12
    },
    {
        id: 4,
        type: 'end',
        text: '看这条路，便是他们曾走过的。',
        audio: `/audio/chapter2/chapter2_three_4.mp3`,
        duration: 3
    }
]

// 漫游路线
export const chapter2RoamPath = [
    [117.79334545310229, 30.478201812398947, 664.2745619291168],
    [117.79330211937403, 30.478264998234817, 664.2744914363707],
    [117.79322965713763, 30.478369565444254, 664.2744003068619],
    [117.79318694031156, 30.47842909392039, 664.2743731256802],
    [117.79316828589317, 30.478466521897154, 666.8421850385864],
    [117.7930755969161, 30.478521617011328, 666.8424994866917],
    [117.79304855580776, 30.478542202656584, 666.933760546084],
    [117.79301398501042, 30.478538652202197, 668.2718428190915],
    [117.79299884900809, 30.478536353190737, 667.994612034251],
    [117.79296901964399, 30.478594654141286, 668.7455486825963],
    [117.7929549965004, 30.478642429173547, 669.1359565372644],
    [117.79293989621868, 30.478710239061947, 669.1357685429294],
    [117.79291734170825, 30.478820951431143, 678.1144819757902],
    [117.7928991543733, 30.47890688347013, 685.0831097766193],
    [117.79290142454309, 30.47895175437733, 685.082981130418],
    [117.79287782585787, 30.479121784445386, 685.0824820408703],
    [117.79295786006236, 30.479119796360973, 685.0819786145461],
    [117.79298433270161, 30.479096581088676, 685.4132619999818],
    [117.79298585864224, 30.47907272702281, 685.4990337786924],
    [117.79295304220659, 30.479064107305366, 685.4992890826575],
    [117.79296216186417, 30.4789949899299, 685.4994770122112],
    [117.79304005241161, 30.479003870444654, 685.4989584471158],
    [117.79303125284973, 30.479069584057502, 685.498779467589],
    [117.79299430610381, 30.4790701320205, 685.4990397088786],
    [117.79298689445712, 30.479109790369787, 685.4178993519372],
    [117.7930096111997, 30.479132299969883, 685.0816119791982],
    [117.79300734468335, 30.479162479905092, 685.0815258864983],
    [117.79300296710745, 30.479225695716735, 682.1711115383843],
    [117.79299489769453, 30.479305500044173, 682.1708884730259],
    [117.79295525345339, 30.479348727469066, 682.1709833543532]
]

// Marker点位
export const chapter2MarkerPoints = [
    {
        name: '81级台阶',
        texturePath: `${markerBasePath}/marker/marker.png`,
        points: [[117.79293614108369, 30.47874494776247, 672.0495845778332]],
        pointSize: [38, 38],
        enableDepthTest: false,
        description: '台阶共81级，寓意征修行路上的九九八十一难。'
    },
    {
        name: '十王殿',
        texturePath: `${markerBasePath}/marker/marker.png`,
        points: [[117.79311725669695, 30.478567356136985, 671.8816096339514]],
        pointSize: [38, 38],
        enableDepthTest: false,
        description:
            '十王殿，又称转轮宝殿。始建清朝，于1990年重建。这座坐北朝南的两进宫殿式建筑，面积达约748平方米。'
    },
    {
        name: '鼓楼',
        texturePath: `${markerBasePath}/marker/marker.png`,
        points: [[117.79313438593258, 30.479300933181875, 689.1067085277715]],
        pointSize: [38, 38],
        enableDepthTest: false,
        description:
            '九华山月身宝殿的钟楼和鼓楼位于殿宇两侧，呈对称分布，是月身殿建筑群的重要组成部分。'
    },
    {
        name: '钟楼',
        texturePath: `${markerBasePath}/marker/marker.png`,
        points: [[117.79282415161572, 30.479275946183552, 689.7010170914857]],
        pointSize: [38, 38],
        enableDepthTest: false,
        description:
            '九华山月身宝殿的钟楼和鼓楼位于殿宇两侧，呈对称分布，是月身殿建筑群的重要组成部分。'
    },
    {
        name: '月身宝殿',
        texturePath: `${markerBasePath}/marker/marker.png`,
        points: [[117.79297705043088, 30.479112308442332, 690.7604877902704]],
        pointSize: [38, 38],
        enableDepthTest: false,
        description:
            '月身宝殿为月身殿建筑群中的主殿，建筑占地面积256平方米，平面呈边长16米的正方形。建筑上盖铁瓦，四角有宫殿式翘檐，形制为"殿中有塔，塔在殿中"。',
        video: `${staticResourceUrl}/rsd.mp4`
    },
    {
        name: '护国月身宝塔殿',
        texturePath: `${markerBasePath}/marker/marker.png`,
        points: [[117.79297803725561, 30.479090787963354, 694.5576988880699]],
        pointSize: [38, 38],
        enableDepthTest: false,
        description: '万历中期，朝廷颁银重修塔殿，并赐额"护国月身宝殿"。现为赵朴初所书。'
    },
    {
        name: '东南第一山',
        texturePath: `${markerBasePath}/marker/marker.png`,
        points: [[117.79297400256982, 30.479085704713906, 690.1274970023294]],
        pointSize: [38, 38],
        enableDepthTest: false,
        description: '晚清青阳举人施玉藻题匾"东南第一山"。'
    },
    {
        name: '雕梁画栋',
        texturePath: `${markerBasePath}/marker/marker.png`,
        points: [[117.79304241970307, 30.479117132933858, 690.341534442624]],
        pointSize: [38, 38],
        enableDepthTest: false,
        description:
            '木构架上雕梁画栋，装饰考究，有龙首、花鸟云纹、动物等图案，内容多为戏文中人物及佛事活动场景，色彩鲜艳。'
    },
    {
        name: '七层八方木塔',
        texturePath: `${markerBasePath}/marker/marker.png`,
        points: [[117.79299794822576, 30.47904756281187, 689.9515655266397]],
        pointSize: [38, 38],
        enableDepthTest: false,
        description: '殿内塔基上建有七层八方木塔，每层木塔有佛龛供地藏菩萨像。'
    },
    {
        name: '99级台阶',
        texturePath: `${markerBasePath}/marker/marker.png`,
        points: [[117.79278703463727, 30.479273575104756, 676.450315826544]],
        pointSize: [38, 38],
        enableDepthTest: false,
        description: '99级台阶，象征着金地藏99岁圆寂。'
    }
]
