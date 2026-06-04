/**
 * generate-translations.js — 六十四卦白话文译文生成脚本
 *
 * 设计说明：
 * 将所有卦象的白话文译文写入 packages/iching-data/src/translations/ 目录。
 * 译文基于经典注疏（朱熹《周易本义》、程颐《伊川易传》等）整理。
 * 每个卦象包含：卦辞译文、彖传译文、象传译文、各爻译文。
 */

const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, '..', 'packages', 'iching-data', 'src', 'translations');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

// 六十四卦白话文译文数据
const translations = [
// #1 乾
{
  id: 1,
  guaci_trans: "大通顺利，利于坚守正道。",
  tuan_trans: "伟大啊，乾元之气！万物依赖它而创始，它统领着天道。云行雨降，万物各得其形。日出日落，六个爻位按时序形成，如同乘着六条龙驾驭天道。乾道变化运行，万物各自端正本性命理，保持最和谐的状态，才有利于坚守正道。万物之首出现，天下万国都安宁。",
  xiang_trans: "天道运行刚健不息，君子应当效法天道，自强不息。",
  yaoci_trans: [
    {position:1, text_trans:"龙潜伏在水中，暂时不宜施展才能。", xiang_trans:"龙潜伏不用，是因为阳气还在下方。"},
    {position:2, text_trans:"龙出现在田野中，利于拜见大德之人。", xiang_trans:"龙出现在田野，是因为德行广泛施布。"},
    {position:3, text_trans:"君子整日勤勉不懈，到了晚上仍保持警惕，虽然处境艰难，但没有灾祸。", xiang_trans:"整日勤勉不懈，是在反复实践道义。"},
    {position:4, text_trans:"龙或跃上高处或仍留在深渊，没有灾祸。", xiang_trans:"或跃在渊，前进不会有灾祸。"},
    {position:5, text_trans:"龙飞翔在天空，利于拜见大德之人。", xiang_trans:"龙飞在天，是大人物建功立业之时。"},
    {position:6, text_trans:"龙飞得过高，将会有悔恨。", xiang_trans:"龙飞得过高会有悔恨，因为盈满不可长久。"},
    {position:7, text_trans:"群龙出现而没有首领，吉祥。", xiang_trans:"用九之道，天之德不可自居为首。"}
  ]
},
// #2 坤
{
  id: 2,
  guaci_trans: "大通顺利，利于像母马一样柔顺坚贞。君子有所前往，先会迷失方向，后来会找到主导。利于在西南方结交朋友，在东北方离别朋友。安于正道则吉祥。",
  tuan_trans: "至极啊，坤元之德！万物依赖它而化生，它顺承天道。坤厚载万物，德行广大无疆。涵容广大，万物都能亨通。母马属于地上之物，行走大地没有边际，柔顺而利于坚守正道。君子有所前往，先迷是因偏离常道，后顺则可得到正常法则。西南方得朋友，是与同类同行。东北方丧朋友，终有喜庆之事。安于正道之吉，是与大地之德相应。",
  xiang_trans: "大地的形势厚实和顺，君子应当以深厚的德行承载万物。",
  yaoci_trans: [
    {position:1, text_trans:"踩到了霜，坚冰即将到来。", xiang_trans:"踩到霜就知道坚冰将至，阴气开始凝聚。顺着这个趋势发展，坚冰就会到来。"},
    {position:2, text_trans:"正直、方正、广大，不需要刻意学习也没有不利。", xiang_trans:"六二的变动是正直的，不需要学习也没有不利，是因为地道的光明。"},
    {position:3, text_trans:"含蓄自己的才华美德，可以为王事效力。不自居功劳，而是善始善终。", xiang_trans:"含蓄才华为王事效力，是因为等待适当的时机而发挥。"},
    {position:4, text_trans:"扎紧口袋，既无灾祸也无赞誉。", xiang_trans:"扎紧口袋没有灾祸，是因为谨慎不会有害。"},
    {position:5, text_trans:"黄色的下裳，大吉大利。", xiang_trans:"黄裳大吉，是因为有文采在内。"},
    {position:6, text_trans:"龙在旷野中战斗，血是青黄色的。", xiang_trans:"龙在旷野战斗，是因为道穷到了尽头。"},
    {position:7, text_trans:"利于永远坚守正道。", xiang_trans:"用六永远坚守正道，是以大终之道。"}
  ]
},
// #3 屯
{
  id: 3,
  guaci_trans: "大通顺利，利于坚守正道。不宜有所前往，利于建立诸侯。",
  tuan_trans: "屯卦，刚柔初次交合而生出艰难。在险难中行动，大通顺利且坚守正道。雷雨交加充满天地之间，天造草昧之际，适宜建立诸侯而不宜安逸。",
  xiang_trans: "云雷交汇，象征初生的艰难。君子应当谋划经营事业。",
  yaoci_trans: [
    {position:1, text_trans:"徘徊不前，利于安居守正，利于建立诸侯。", xiang_trans:"虽然徘徊不前，但志向和行为是正当的。以尊贵之身礼贤下士，大得民心。"},
    {position:2, text_trans:"艰难困顿，乘马徘徊。不是来抢夺的，是来求婚的。女子坚守正道不嫁，十年之后才出嫁。", xiang_trans:"六二的艰难，是因为处在刚爻之上。十年才出嫁，是回归正常的状态。"},
    {position:3, text_trans:"追逐野鹿没有向导，只会迷失在山林中。君子不如放弃，继续前进会有困辱。", xiang_trans:"追逐野鹿没有向导，是贪图猎物。君子放弃，继续前进则有困辱。"},
    {position:4, text_trans:"乘马徘徊，前去求婚，前进则吉，没有不利。", xiang_trans:"求而往前是明智的。"},
    {position:5, text_trans:"屯积恩泽，小事则吉，大事则凶。", xiang_trans:"屯积恩泽，施恩尚未广泛普及。"},
    {position:6, text_trans:"乘马徘徊，哭泣连连。", xiang_trans:"哭泣连连，怎能长久呢？"}
  ]
},
// #4 蒙
{
  id: 4,
  guaci_trans: "亨通。不是我去求蒙昧的学童，而是学童来求我。初次占问告诉答案，再三则是亵渎，亵渎就不再告知。利于坚守正道。",
  tuan_trans: "蒙卦，山下有险，遇险而止，就是蒙昧。蒙昧而亨通，是因为亨通的时机和行动合宜。不是我求蒙童，是蒙童求我，这是心志相应。初筮则告，是因为刚正居中。再三亵渎就不告诉，亵渎蒙昧无益。蒙以养正，这是圣人之功。",
  xiang_trans: "山下涌出泉水，象征蒙昧。君子应以果断的行动来培养德行。",
  yaoci_trans: [
    {position:1, text_trans:"启发蒙昧，利于用刑罚来规范，用以去除桎梏。不然前进会有困辱。", xiang_trans:"利于用刑罚规范，是为了端正法度。"},
    {position:2, text_trans:"包容蒙昧的人，吉祥。娶妻吉祥。子女能治理家业。", xiang_trans:"子女能治理家业，是因为刚柔相济。"},
    {position:3, text_trans:"不要娶这个女子，见到有财势的人就不保持节操，没有利处。", xiang_trans:"不要娶这个女子，因为她行为不端。"},
    {position:4, text_trans:"被蒙昧困住，有困辱。", xiang_trans:"被蒙昧所困的困辱，是因为远离了实际。"},
    {position:5, text_trans:"像天真的孩童那样蒙昧，吉祥。", xiang_trans:"童蒙之吉，是因为柔顺居中。"},
    {position:6, text_trans:"击打蒙昧之人，不利于做强盗，利于防御强盗。", xiang_trans:"利于防御强盗，上下顺应。"}
  ]
},
// #5 需
{
  id: 5,
  guaci_trans: "有诚信，光明亨通，坚守正道则吉祥。利于渡过大河。",
  tuan_trans: "需，是等待之意。险在前方，有刚健而不陷入，其义理不会穷困。需有诚信，光明亨通而贞吉，是因为居位得当合于天道。利于涉越大川，是前往必有功绩。",
  xiang_trans: "云升到天上尚未降雨，象征等待。君子应当饮食宴乐，安享等待。",
  yaoci_trans: [
    {position:1, text_trans:"在郊外等待，利于保持恒常，没有灾祸。", xiang_trans:"在郊外等待，不冒进犯难。利于保持恒常没有灾祸，是因为没有违背常理。"},
    {position:2, text_trans:"在沙滩上等待，稍有闲话，终将吉祥。", xiang_trans:"在沙滩上等待，从容处于中位。虽然稍有闲话，终将吉祥。"},
    {position:3, text_trans:"在泥泞中等待，招来盗贼。", xiang_trans:"在泥泞中等待，灾祸在外面。自己招来盗贼，敬慎则不会受害。"},
    {position:4, text_trans:"在血泊中等待，要从洞穴中脱身。", xiang_trans:"在血泊中等待，是因为顺从而听命。"},
    {position:5, text_trans:"在酒食旁等待，坚守正道则吉祥。", xiang_trans:"酒食贞吉，是因为居中得正。"},
    {position:6, text_trans:"掉入洞穴中，有三个不速之客来到，恭敬地对待他们则终将吉祥。", xiang_trans:"不速之客来到，恭敬他们则终吉。虽然位置不当，但尚未有大的损失。"}
  ]
},
// #6 讼
{
  id: 6,
  guaci_trans: "有诚信但被阻塞，心怀警惕。居中则吉，走到终极则凶。利于拜见大人，不利于渡过大河。",
  tuan_trans: "讼卦，上刚下险，有险而又刚健，就是讼。讼有诚信被阻塞而心怀警惕，居中则吉，是因为刚来而得中位。终极则凶，讼事不可做到底。利于拜见大人，是尊尚中正之德。不利涉越大川，是入于深渊。",
  xiang_trans: "天与水方向相违，象征争讼。君子做事时应当谋划好开端。",
  yaoci_trans: [
    {position:1, text_trans:"不把争讼之事坚持到底，稍有闲话，终将吉祥。", xiang_trans:"不把争讼坚持到底，讼事不可久拖。虽然稍有闲话，辩论就会明晰。"},
    {position:2, text_trans:"争讼不能取胜，回来逃避。邑中三百户人家，没有灾祸。", xiang_trans:"争讼不能取胜，回来逃避。从下面争讼到上面，自取患难。"},
    {position:3, text_trans:"依靠旧有的德行生活，坚守正道则有危险但终将吉祥。或者为王事效力，不居功劳。", xiang_trans:"依靠旧有德行生活，顺从上面则吉。"},
    {position:4, text_trans:"争讼不能取胜，回头服从命令。安于正道则吉祥。", xiang_trans:"回头服从命令，安于正道不失其分。"},
    {position:5, text_trans:"争讼，大吉大利。", xiang_trans:"讼而大吉，是因为居中得正。"},
    {position:6, text_trans:"或许会赐给官服腰带，但在一天之内三次被剥夺。", xiang_trans:"以争讼受到的赏赐，不值得尊敬。"}
  ]
},
// #7 师
{
  id: 7,
  guaci_trans: "坚守正道，由德高望重的长者统帅则吉祥，没有灾祸。",
  tuan_trans: "师，是众人之意。贞，是正的意思。能以正道率领众人，则可以称王天下。刚正居中而得到响应，在险难中顺从行事，以此毒害天下而民众服从，则吉祥又有何灾祸？",
  xiang_trans: "地中有水，象征军队。君子应当容纳百姓，养育万民。",
  yaoci_trans: [
    {position:1, text_trans:"军队出征必须遵守纪律，否则不论善恶都有凶险。", xiang_trans:"军队出征必须遵守纪律，失律则凶。"},
    {position:2, text_trans:"身在军中，吉祥无灾。天子三次授予嘉奖。", xiang_trans:"身在军中之吉，承受天恩。天子三次嘉奖，怀柔万国。"},
    {position:3, text_trans:"军队中可能有伤亡载尸，凶险。", xiang_trans:"军队中有伤亡，大无功绩。"},
    {position:4, text_trans:"军队后退驻扎，没有灾祸。", xiang_trans:"左次无灾，未失常理。"},
    {position:5, text_trans:"田地里有猎物，利于捕获并追讨罪责，没有灾祸。长子统率军队，次子运载尸体，坚守正道也有凶险。", xiang_trans:"长子帅师，以中道行事。次子载尸，委任不当。"},
    {position:6, text_trans:"大君有命令，开国封侯。小人不可用。", xiang_trans:"大君有命，以功正国。小人不可用，必扰乱国家。"}
  ]
},
// #8 比
{
  id: 8,
  guaci_trans: "吉祥。推究占卜显示：大通顺利、持久、正固，没有灾祸。不安宁的方国前来归附，迟迟未来者有凶险。",
  tuan_trans: "比卦，吉祥。比是辅助之意。下顺从上。推究占卜显示大通持久正固无灾，是因为以刚正居中。不安宁的方国前来归附，上下相应。迟迟未来者有凶，因其道理已穷尽。",
  xiang_trans: "地上有水，象征亲比。先王效法此道，建立万国、亲近诸侯。",
  yaoci_trans: [
    {position:1, text_trans:"有诚信地亲比，没有灾祸。有诚信盈满在内，犹如盛满酒的土缶，终将有意外的来访。吉祥。", xiang_trans:"比卦开始就有诚信之吉。"},
    {position:2, text_trans:"从内部亲近，坚守正道则吉祥。", xiang_trans:"从内部亲近，不会自己失位。"},
    {position:3, text_trans:"所亲近的都是不正当的人。", xiang_trans:"所亲近的不正当，不也是可悲的吗？"},
    {position:4, text_trans:"从外部亲近，坚守正道则吉祥。", xiang_trans:"从外部亲近贤者，是顺从上面。"},
    {position:5, text_trans:"显明的亲比。天子围猎时三面驱赶，放走前面逃跑的猎物。邑人不加劝诫，吉祥。", xiang_trans:"显明亲比之吉，位正而居中。放走前面逃跑的，是不用驱赶。邑人不加劝诫，是使上下都归附。"},
    {position:6, text_trans:"亲比没有开头，凶险。", xiang_trans:"亲比没有开头，没有好结局。"}
  ]
},
// #9 小畜
{
  id: 9,
  guaci_trans: "亨通。密云从西方飘来却不下雨。",
  tuan_trans: "小畜卦，柔爻得位而上下都响应，称为小畜。刚健而逊顺，阳刚居中而有意志行走，所以亨通。密云不雨，还在往前行进。从我西郊来，是施予尚未实行。",
  xiang_trans: "风行天上，象征小有积蓄。君子应当修饰文德。",
  yaoci_trans: [
    {position:1, text_trans:"沿着自己的正道返回，有什么灾祸呢？吉祥。", xiang_trans:"沿着正道返回，其义理是吉祥的。"},
    {position:2, text_trans:"被牵引而返回，吉祥。", xiang_trans:"被牵引而返回，也未失去中道。"},
    {position:3, text_trans:"车轮的辐条脱落。夫妻互相对视不和。", xiang_trans:"夫妻对视不和，不能治理家事。"},
    {position:4, text_trans:"有诚信，血去了恐惧也消除了，没有灾祸。", xiang_trans:"有诚信而恐惧消除，上面合志。"},
    {position:5, text_trans:"有诚信，紧密联结如邻居，不仅富裕自己。", xiang_trans:"有诚信紧密联结，不是独自富有。"},
    {position:6, text_trans:"已经下雨了，已经停止了。崇尚积蓄德行。妇人坚守正道有危险。月亮将近十五满月，君子出征有凶。", xiang_trans:"已经下雨而停止，德行已经积蓄充满。君子出征有凶，有所疑忌。"}
  ]
},
// #10 履
{
  id: 10,
  guaci_trans: "踩着老虎的尾巴，老虎没有咬人，亨通。",
  tuan_trans: "履卦，柔踩着刚。和悦而响应乾健，所以踩着老虎尾巴而不被咬，亨通。刚正居中而践行帝王之位，不感到愧疚，光明正大。",
  xiang_trans: "天在上、泽在下，象征履行礼仪。君子应当分辨上下，安定民心。",
  yaoci_trans: [
    {position:1, text_trans:"朴素地前行，没有灾祸。", xiang_trans:"朴素地前行，独行其愿。"},
    {position:2, text_trans:"在平坦的大道上行走，隐居之人坚守正道则吉祥。", xiang_trans:"隐居之人贞吉，居中而不自乱。"},
    {position:3, text_trans:"眇能视，跛能履。踩到老虎尾巴被老虎咬了，凶险。武人要做大君。", xiang_trans:"眇能视，不足以看清。跛能履，不足以同行。被咬之凶，位置不当。武人为大君，志向刚强。"},
    {position:4, text_trans:"踩着老虎的尾巴，恐惧戒慎，终将吉祥。", xiang_trans:"恐惧戒慎终吉，志向得以实行。"},
    {position:5, text_trans:"果断地践行正道，坚守正道有危险。", xiang_trans:"果断践行正道有危险，位置端正恰当。"},
    {position:6, text_trans:"回顾审视自己所行之路，观察祥兆，循环往复则大吉。", xiang_trans:"大吉在上，大有庆贺。"}
  ]
},
// #11 泰
{
  id: 11,
  guaci_trans: "小的离去大的到来，吉祥亨通。",
  tuan_trans: "泰卦，小往而大来，吉亨。即天地交感而万物通达，上下交流而志同道合。内阳外阴，内健外顺，内君子外小人。君子之道长，小人之道消。",
  xiang_trans: "天地交融，象征通泰。君王以此裁度天地之道，辅助天地化育万物，以左右百姓。",
  yaoci_trans: [
    {position:1, text_trans:"拔起茅草连带同类，出征则吉祥。", xiang_trans:"拔茅出征之吉，志向在外。"},
    {position:2, text_trans:"包容荒芜之地，用毅力渡过大河，不遗弃远方之人。朋党消亡，得到尊尚中庸之道的赞许。", xiang_trans:"包容荒芜得中庸之赞，是因为光大地行走中道。"},
    {position:3, text_trans:"没有平坦而不险陡的路，没有去而不回的事。在艰难中坚守正道没有灾祸。不必忧虑，享有诚信的福禄。", xiang_trans:"没有去而不回的事，天地之间的道理就是如此。"},
    {position:4, text_trans:"翩翩而来不自负富有，与邻居真诚交往，不用告诫也有诚信。", xiang_trans:"翩翩而来不自负富有，都失去了常态。不用告诫也有诚信，是内心的愿望。"},
    {position:5, text_trans:"帝乙嫁女儿，因此得到福祉，大吉大利。", xiang_trans:"因此得到福祉大吉，居中而有所行动。"},
    {position:6, text_trans:"城墙倒塌回复为护城河。不用出征。从自己的邑中发布命令，坚守正道却有困辱。", xiang_trans:"城墙倒塌回复为壕，命运已经紊乱。"}
  ]
},
// #12 否
{
  id: 12,
  guaci_trans: "闭塞不通，此非人之正道。不利于君子坚守正道。大的离去小的到来。",
  tuan_trans: "否之非人道，不利君子贞。大往小来，即天地不交而万物不通，上下不交而天下无邦国。内阴外阳，内柔外刚，内小人外君子。小人之道长，君子之道消。",
  xiang_trans: "天地不交，象征闭塞。君子应当俭约以避难，不可以俸禄为荣。",
  yaoci_trans: [
    {position:1, text_trans:"拔起茅草连带同类，坚守正道则吉祥亨通。", xiang_trans:"拔茅贞吉，志向在君上。"},
    {position:2, text_trans:"包容顺从，小人吉祥。大人处于否闭之世，亨通。", xiang_trans:"大人否而亨，不扰乱群众。"},
    {position:3, text_trans:"包藏羞耻。", xiang_trans:"包藏羞耻，位置不当。"},
    {position:4, text_trans:"有天命的人没有灾祸。同类都得到福报。", xiang_trans:"有命无灾，志向得以实行。"},
    {position:5, text_trans:"停止闭塞，大人吉祥。将要灭亡，将要灭亡！系于桑树根上才安全。", xiang_trans:"大人之吉，位置正而恰当。"},
    {position:6, text_trans:"倾覆闭塞。先是闭塞，后来欢乐。", xiang_trans:"否终则倾覆，怎能长久呢？"}
  ]
},
// #13 同人
{
  id: 13,
  guaci_trans: "与人和同于旷野，亨通。利于渡过大河。利于君子坚守正道。",
  tuan_trans: "同人卦，柔得位而居中，与乾相应，称为同人。同人于野亨，利涉大川，是乾之德。以文明之德行正道，是中正之道而响应于乾，这是君子之道。唯有君子能通达天下人的志向。",
  xiang_trans: "天与火在一起，象征同人。君子应当以族类辨别事物。",
  yaoci_trans: [
    {position:1, text_trans:"与人和同在门口，没有灾祸。", xiang_trans:"出门与人和同，又有谁会怪罪呢？"},
    {position:2, text_trans:"与同宗族的人和同，有困辱。", xiang_trans:"与同宗族人和同，是困辱之道。"},
    {position:3, text_trans:"在草丛中埋伏兵马，登上高丘瞭望，三年都不敢出兵。", xiang_trans:"在草丛中埋伏兵马，敌人刚强。三年不出兵，怎能有所为？"},
    {position:4, text_trans:"登上城墙，不能攻取，吉祥。", xiang_trans:"登上城墙是困难的。吉是因为困而返回正道。"},
    {position:5, text_trans:"与人和同，先嚎啕大哭后欢笑，大军相遇。", xiang_trans:"同人的开始，以中正之道相合。大军相遇，是说能够互相克胜。"},
    {position:6, text_trans:"在郊外与人和同，没有悔恨。", xiang_trans:"在郊外与人和同，志向未得到实现。"}
  ]
},
// #14 大有
{
  id: 14,
  guaci_trans: "大通顺利。",
  tuan_trans: "大有卦，柔爻得到尊位且居大位而居中，上下都响应，称为大有。其德刚健而文明，顺应天道而适时行事，所以大通顺利。",
  xiang_trans: "火在天上，象征大有。君子应当遏止邪恶、弘扬善行，顺天命而行。",
  yaoci_trans: [
    {position:1, text_trans:"不与有害的事物交往，没有灾祸。艰难但没有灾祸。", xiang_trans:"大有开始，不与害交往。"},
    {position:2, text_trans:"用大车载物，有所往，没有灾祸。", xiang_trans:"大车载物，积聚在中不会败坏。"},
    {position:3, text_trans:"诸侯向天子进贡，小人不能做到。", xiang_trans:"诸侯向天子进贡，小人是有害的。"},
    {position:4, text_trans:"否定自己的盛大，没有灾祸。", xiang_trans:"否定自己的盛大没有灾祸，是明辨之功。"},
    {position:5, text_trans:"诚信交感互相信任，威严则吉。", xiang_trans:"诚信交感的信任，是因为志向发自真心。威严之吉，简易而不费力便能被信服。"},
    {position:6, text_trans:"上天保佑他，吉祥没有不利。", xiang_trans:"大有之上大吉，来自上天的保佑。"}
  ]
},
// #15 谦
{
  id: 15,
  guaci_trans: "亨通，君子有好的结局。",
  tuan_trans: "谦卦亨通，天道亏损盈满而增补谦虚，地道变改盈满而流向谦下，鬼神祸害盈满而福佑谦虚，人道厌恶骄满而喜好谦虚。谦虚而尊贵光明，谦虚而卑下不可逾越，这是君子的好结局。",
  xiang_trans: "地中有山，象征谦虚。君子应当减损多余的、增补不足的，权衡公平施予。",
  yaoci_trans: [
    {position:1, text_trans:"谦虚又谦虚的君子，可以渡过大河，吉祥。", xiang_trans:"谦虚的君子，以卑下之道修养自身。"},
    {position:2, text_trans:"谦虚的美名远扬，坚守正道则吉祥。", xiang_trans:"谦虚美名远扬之吉，是发自内心的中正。"},
    {position:3, text_trans:"有功劳而谦虚的君子，有好的结局，吉祥。", xiang_trans:"有功劳而谦虚的君子，万民都服从。"},
    {position:4, text_trans:"没有不利，发挥谦虚的美德。", xiang_trans:"没有不利，发挥谦虚，不违背常理。"},
    {position:5, text_trans:"不因富有而对邻居骄横，利于进攻征伐，没有不利。", xiang_trans:"利于征伐，是讨伐不服从的人。"},
    {position:6, text_trans:"谦虚的美名远扬，利于出征讨伐邑国。", xiang_trans:"谦虚美名远扬，志向未得满足。可以出征讨伐邑国。"}
  ]
},
// #16 豫
{
  id: 16,
  guaci_trans: "利于建立诸侯、出兵征伐。",
  tuan_trans: "豫卦，刚应而志行，顺从而动，就是豫。豫顺从而动，所以天地都如此，何况建侯行师呢？天地以顺动，所以日月不过失而四时不忒。圣人以顺动，则刑罚清楚而民服。豫之时义大矣哉！",
  xiang_trans: "雷从地下震出，象征欢豫。先王效法此道，作乐崇德，殷荐上帝，以配先祖。",
  yaoci_trans: [
    {position:1, text_trans:"鸣叫自得的安乐，凶险。", xiang_trans:"初六鸣叫安乐，志向穷尽则凶。"},
    {position:2, text_trans:"坚硬如磐石，不等一天，坚守正道则吉祥。", xiang_trans:"不等一天贞吉，是因为居中得正。"},
    {position:3, text_trans:"仰望他人而安乐，迟了会有悔恨。", xiang_trans:"仰望他人安乐而有悔恨，位置不当。"},
    {position:4, text_trans:"从安乐中大有收获。不要怀疑，朋友簪聚而来。", xiang_trans:"从安乐中大有收获，志向大行。"},
    {position:5, text_trans:"坚守正道有疾病，经久不死。", xiang_trans:"六五贞疾，乘刚之上。经久不死，居中而未亡。"},
    {position:6, text_trans:"安乐已到极点而昏暗，但有所改变就没有灾祸。", xiang_trans:"极乐而昏暗在上位，怎能长久呢？"}
  ]
},
// #17-64 继续...
// 为节省空间，以下采用紧凑格式

// #17 随
{id:17, guaci_trans:"大通顺利，利于坚守正道，没有灾祸。",
  tuan_trans:"随卦，刚来居柔下，动而悦，就是随。大亨利贞无灾，天下随从之时义大矣。",
  xiang_trans:"泽中有雷，象征随从。君子到了日暮就回家休息。",
  yaoci_trans:[
    {position:1, text_trans:"官职有变更，坚守正道则吉。出门交往有功绩。", xiang_trans:"官职变更，顺从正道则吉。出门有功绩，不失其正。"},
    {position:2, text_trans:"系缚住小童，就失去了丈夫。", xiang_trans:"系缚小童，不能兼得两者。"},
    {position:3, text_trans:"系缚住丈夫，就失去了小童。随从而有所求则会得到。利于安居守正。", xiang_trans:"系缚住丈夫，志向是舍弃下面的。"},
    {position:4, text_trans:"随从而有所获得，坚守正道则有凶。有诚信在道路上光明正大，有什么灾祸呢？", xiang_trans:"随从有获之凶，其义理是凶的。有诚信在道上，是因为明辨而没有过失。"},
    {position:5, text_trans:"信任嘉美的人，吉祥。", xiang_trans:"信任嘉美之吉，位正居中。"},
    {position:6, text_trans:"捆绑而系之，又再加以维系。天子因此在西山祭祀。", xiang_trans:"拘系在上面，已到穷尽之极。"}
  ]},
// #18 蛊
{id:18, guaci_trans:"大通顺利，利于渡过大河。（出发）前三天和后三天（要谨慎筹备）。",
  tuan_trans:"蛊卦，刚在上而柔在下，逊顺而止，就是蛊。蛊大亨而天下大治。利涉大川，前往有事功。先甲三日后甲三日，终则有始，天行之道。",
  xiang_trans:"山下有风，象征蛊惑败坏。君子应当振兴民众，培育美德。",
  yaoci_trans:[
    {position:1, text_trans:"匡正父亲遗留的弊病。有这样的儿子，先父没有灾祸，虽然危险但终将吉祥。", xiang_trans:"匡正父亲的弊病，是继承父亲之志。"},
    {position:2, text_trans:"匡正母亲遗留的弊病，不可太过刚强。", xiang_trans:"匡正母亲的弊病，得中道而行。"},
    {position:3, text_trans:"匡正父亲的弊病，稍有悔恨，但没有大的灾祸。", xiang_trans:"匡正父亲的弊病，终究没有灾祸。"},
    {position:4, text_trans:"宽容对待父亲的弊病，前往会有困辱。", xiang_trans:"宽容父亲的弊病，前往未得到正道。"},
    {position:5, text_trans:"匡正父亲的弊病，使用荣誉。", xiang_trans:"匡正父亲而用荣誉，承继以德。"},
    {position:6, text_trans:"不侍奉王侯，崇尚高洁的情操。", xiang_trans:"不侍奉王侯，志向可以效法。"}
  ]},
// #19 临
{id:19, guaci_trans:"大通顺利，利于坚守正道。到了八月会有凶险。",
  tuan_trans:"临卦，刚浸而长。说而顺，刚中而应。大亨以正，天之道也。至于八月有凶，消不久也。",
  xiang_trans:"泽上有地，象征临近。君子以此教导不倦，容纳保护民众无限。",
  yaoci_trans:[
    {position:1, text_trans:"感化亲临，坚守正道则吉祥。", xiang_trans:"感化亲临之吉，志向行正道。"},
    {position:2, text_trans:"感化亲临，吉祥，没有不利。", xiang_trans:"感化亲临之吉无不利，尚未顺从天命。"},
    {position:3, text_trans:"甜言蜜语地亲临，没有什么利处。已经忧虑了就没有灾祸。", xiang_trans:"甜言蜜语地亲临，位置不当。已经忧虑则无灾祸。"},
    {position:4, text_trans:"至诚亲临，没有灾祸。", xiang_trans:"至诚亲临无灾，位置恰当。"},
    {position:5, text_trans:"用智慧亲临，是大君的宜行之道，吉祥。", xiang_trans:"大君之宜，行中之道。"},
    {position:6, text_trans:"敦厚亲临，吉祥，没有灾祸。", xiang_trans:"敦厚亲临之吉，志向在内。"}
  ]},
// #20 观
{id:20, guaci_trans:"洗手净心尚未献祭，满怀诚敬仰望。",
  tuan_trans:"观卦，大观在上，顺从而逊巽，居中得正以观天下。观，洗手净心尚未献祭而满怀诚敬，下面的人仰望而感化。观天之神道，四时运行不差。圣人以神道设教，天下臣服。",
  xiang_trans:"风行地上，象征观察。先王效法此道，巡视四方，观察民情，设施教化。",
  yaoci_trans:[
    {position:1, text_trans:"像小孩子一样观察，小人没有灾祸，君子则有困辱。", xiang_trans:"像小孩子观察，是小人之道。"},
    {position:2, text_trans:"从门缝里窥视，利于女子坚守正道。", xiang_trans:"从门缝窥视是女贞之道，也是可羞耻的。"},
    {position:3, text_trans:"观察自己的生活方式，决定进退。", xiang_trans:"观察自己的生活进退，未失其道。"},
    {position:4, text_trans:"观察国家的光荣，利于做天子的宾客。", xiang_trans:"观察国家的光荣，崇尚宾客之道。"},
    {position:5, text_trans:"观察自己的生活方式，君子没有灾祸。", xiang_trans:"观察自己的生活，观察民众的风俗。"},
    {position:6, text_trans:"观察其道义，君子没有灾祸。", xiang_trans:"观察其道义，志向未安宁。"}
  ]},
// #21 噬嗑
{id:21, guaci_trans:"亨通，利于运用刑罚。",
  tuan_trans:"颐中有物，称为噬嗑。噬嗑而亨通。刚柔分离，动而明，雷电合而章。柔得中而上行，虽不当位却利于用刑。",
  xiang_trans:"雷电交合，象征噬嗑。先王效法此道，明定刑罚法令。",
  yaoci_trans:[
    {position:1, text_trans:"脚戴上刑具，损伤了脚趾，没有灾祸。", xiang_trans:"脚戴刑具损伤脚趾，不能行走。"},
    {position:2, text_trans:"咬入肌肤而咬到鼻子，没有灾祸。", xiang_trans:"咬肤咬鼻，乘刚也。"},
    {position:3, text_trans:"咬到腊肉遇到毒物，稍有困辱但没有灾祸。", xiang_trans:"遇到毒物，位置不当。"},
    {position:4, text_trans:"咬到干肉得到金属箭头，利于坚守正道面对艰难，吉祥。", xiang_trans:"利于艰难贞吉，尚未得到光明。"},
    {position:5, text_trans:"咬到干肉得到黄金，坚守正道有危险但没有灾祸。", xiang_trans:"贞厉无灾，得当也。"},
    {position:6, text_trans:"肩上戴着枷锁，耳朵被遮蔽，凶险。", xiang_trans:"戴枷灭耳，听力不明。"}
  ]},
// #22 贲
{id:22, guaci_trans:"亨通，稍利于有所前往。",
  tuan_trans:"贲卦亨通。柔来文饰刚，所以亨通。分出刚来文饰柔，所以小利有攸往。天文也。文明以止，人文也。观乎天文以察时变，观乎人文以化成天下。",
  xiang_trans:"山下有火，象征修饰。君子以此治理政务，不敢以文饰断案。",
  yaoci_trans:[
    {position:1, text_trans:"修饰脚趾，舍弃车而步行。", xiang_trans:"舍弃车而步行，道义上不应乘车。"},
    {position:2, text_trans:"修饰他的胡须。", xiang_trans:"修饰胡须，与上面一起兴起。"},
    {position:3, text_trans:"修饰得润泽光彩，永远坚守正道则吉祥。", xiang_trans:"永远坚守正道之吉，终究没有人能侵犯。"},
    {position:4, text_trans:"修饰得素白如白马飞奔，不是来抢夺而是来求婚的。", xiang_trans:"六四的位置恰当，有所疑虑。不是抢夺是求婚，终究没有怨恨。"},
    {position:5, text_trans:"修饰在丘园中，赠送的布帛少而简朴，有困辱但终将吉祥。", xiang_trans:"六五之吉，有喜事。"},
    {position:6, text_trans:"素白的修饰，没有灾祸。", xiang_trans:"素白修饰无灾，是得到了上位的志向。"}
  ]},
// #23 剥
{id:23, guaci_trans:"不利于有所前往。",
  tuan_trans:"剥卦，剥落之意。柔变刚也。不利有攸往，小人道长。顺而止之，观象也。君子崇尚消息盈虚之道，是天行之理。",
  xiang_trans:"山附于地上，象征剥落。上位者以此厚待下面的人安稳其居所。",
  yaoci_trans:[
    {position:1, text_trans:"剥落床的床脚，蔑视正道则凶。", xiang_trans:"剥落床脚，是从下面开始毁坏。"},
    {position:2, text_trans:"剥落床的边框，蔑视正道则凶。", xiang_trans:"剥落床的边框，还没有找到同伴。"},
    {position:3, text_trans:"剥落它，没有灾祸。", xiang_trans:"剥之无灾，失去了上下的关系。"},
    {position:4, text_trans:"剥落到床面，凶险。", xiang_trans:"剥落到床面，已经逼近灾祸了。"},
    {position:5, text_trans:"像穿鱼串一样带领宫人，受到宠爱，没有不利。", xiang_trans:"以宫人受宠，终究没有过失。"},
    {position:6, text_trans:"硕大的果实没有被吃，君子得到车乘，小人的房屋被剥落。", xiang_trans:"君子得车，是因为民众拥载。小人剥庐，终究不可用。"}
  ]},
// #24 复
{id:24, guaci_trans:"亨通，出入没有疾病。朋友来了没有灾祸。反复于其道，七天往返，利于有所前往。",
  tuan_trans:"复亨，刚反。动而以顺行，所以出入无疾，朋来无灾。反复其道七日来复，天行也。利有攸往，刚长也。复其见天地之心乎！",
  xiang_trans:"雷在地中，象征复归。先王效法此道，在冬至日关闭关口，商旅不行，后不巡视四方。",
  yaoci_trans:[
    {position:1, text_trans:"走不远就返回，没有大的悔恨，大吉大利。", xiang_trans:"走不远就返回，以修养自身。"},
    {position:2, text_trans:"完美的复归，吉祥。", xiang_trans:"完美复归之吉，以亲近仁德之人。"},
    {position:3, text_trans:"频繁的复归，虽然有危险但没有灾祸。", xiang_trans:"频繁复归之厉，以义理看没有灾祸。"},
    {position:4, text_trans:"在中途独自返回。", xiang_trans:"在中途独自返回，以顺从正道。"},
    {position:5, text_trans:"敦厚的复归，没有悔恨。", xiang_trans:"敦厚复归无悔恨，以自省居中。"},
    {position:6, text_trans:"迷途的复归，凶险。有灾祸。用兵征伐，终将大败，对其国君凶险，十年不能出征。", xiang_trans:"迷途复归之凶，违背了君道。"}
  ]},
// #25 无妄
{id:25, guaci_trans:"大通顺利，利于坚守正道。如果不走正道，就会有灾祸，不利于有所前往。",
  tuan_trans:"无妄，刚自外来而为主于内。动而健，刚中而应，大亨以正，天之命也。其匪正有眚，不利有攸往，无妄之往何之矣？天命不佑，行矣哉！",
  xiang_trans:"天下有雷行，万物皆无虚妄。先王以此繁茂万物，顺应天时养育万民。",
  yaoci_trans:[
    {position:1, text_trans:"没有虚妄地前往，吉祥。", xiang_trans:"无妄地前往，得到心愿。"},
    {position:2, text_trans:"不是为了收获才耕种，不是为了种菜才开垦荒地。那么利于有所前往。", xiang_trans:"不为收获才耕种，未因富有而为。"},
    {position:3, text_trans:"无妄的灾祸。有人把牛拴着，路人把牛牵走了，是邑人的灾祸。", xiang_trans:"路人牵牛，邑人的灾祸。"},
    {position:4, text_trans:"可以坚守正道，没有灾祸。", xiang_trans:"可以坚守正道无灾，固守之。"},
    {position:5, text_trans:"无妄的疾病，不用吃药自然会好。", xiang_trans:"无妄之药，不可试用。"},
    {position:6, text_trans:"无妄地前行，有灾祸，没有利处。", xiang_trans:"无妄地前行，已到穷尽之极有灾祸。"}
  ]},
// #26 大畜
{id:26, guaci_trans:"利于坚守正道。不在家中吃饭（出外做事）则吉祥。利于渡过大河。",
  tuan_trans:"大畜，刚健笃实，辉光日新，其德刚上而尊贤。能止健，大正也。不家食吉，养贤也。利涉大川，应乎天也。",
  xiang_trans:"天在山中，象征大畜。君子以此多识前贤之言行，以此蓄养自己的德行。",
  yaoci_trans:[
    {position:1, text_trans:"有危险，利于停止。", xiang_trans:"有危险利于停止，不要冒犯灾难。"},
    {position:2, text_trans:"车轮的车轴脱落。", xiang_trans:"车轴脱落，居中而无尤。"},
    {position:3, text_trans:"好马追逐，利于坚守正道面对艰难。说好每天练习驾车防卫。利于有所前往。", xiang_trans:"利于有所前往，上面志向相合。"},
    {position:4, text_trans:"小牛犊的横木护角，大吉。", xiang_trans:"六四大吉，有喜事。"},
    {position:5, text_trans:"阉割过的猪的牙齿，吉祥。", xiang_trans:"六五之吉，有喜庆。"},
    {position:6, text_trans:"多么光明宽广的天衢啊，亨通。", xiang_trans:"多么光明的天衢，道大行也。"}
  ]},
// #27 颐
{id:27, guaci_trans:"坚守正道则吉祥。观察颐养之道，自己寻求充实口中之食。",
  tuan_trans:"颐贞吉，养正则吉也。观颐，观其所养也。自求口实，观其自养也。天地养万物，圣人养贤以及万民。颐之时义大矣哉！",
  xiang_trans:"山下有雷，象征颐养。君子应当谨慎言语，节制饮食。",
  yaoci_trans:[
    {position:1, text_trans:"丢掉你的灵龟，看着我鼓起腮帮子进食。凶险。", xiang_trans:"看着我鼓起腮帮子进食，也不值得尊贵。"},
    {position:2, text_trans:"颠倒颐养之道，从山丘上求取颐养，前进则有凶。", xiang_trans:"六二前进有凶，行为不符合同类。"},
    {position:3, text_trans:"违背颐养之道，坚守正道有凶。十年不要行动，没有利处。", xiang_trans:"十年不要行动，道理上大为不宜。"},
    {position:4, text_trans:"颠倒颐养之道反而吉祥。老虎眈眈虎视，追求不止。没有灾祸。", xiang_trans:"颠倒颐养之吉，上面有光明的施予。"},
    {position:5, text_trans:"违背常理，安居坚守正道则吉祥。不可渡过大河。", xiang_trans:"安居贞吉，顺从以听从上面。"},
    {position:6, text_trans:"从此获得颐养，有危险但吉祥。利于渡过大河。", xiang_trans:"从此获得颐养有危险而吉祥，大有庆贺。"}
  ]},
// #28 大过
{id:28, guaci_trans:"栋梁弯曲，利于有所前往，亨通。",
  tuan_trans:"大过卦，大者过也。栋梁弯曲，本末皆弱。刚过而中，巽而说行，利有攸往，乃亨。大过之时义大矣哉！",
  xiang_trans:"泽水没过树木，象征大过。君子独立不惧，遁世无闷。",
  yaoci_trans:[
    {position:1, text_trans:"用白色的茅草铺垫在下面，没有灾祸。", xiang_trans:"用白茅铺垫，柔在下面。"},
    {position:2, text_trans:"枯杨生出新芽，老夫娶到少妻，没有不利。", xiang_trans:"老夫少妻，是因为相互超越常规。"},
    {position:3, text_trans:"栋梁弯曲下垂，凶险。", xiang_trans:"栋梁弯曲之凶，不能有所支撑。"},
    {position:4, text_trans:"栋梁隆起，吉祥。但有其他事情则有困辱。", xiang_trans:"栋梁隆起之吉，不向下弯曲。"},
    {position:5, text_trans:"枯杨开出花朵，老妇嫁给少夫。无灾祸也无赞誉。", xiang_trans:"枯杨生花，怎能长久？老妇少夫，也可羞耻。"},
    {position:6, text_trans:"过河时水没过头顶，凶险。但没有灾祸。", xiang_trans:"过河没顶之凶，不能怪罪他人。"}
  ]},
// #29 坎
{id:29, guaci_trans:"有诚信则能维系内心的亨通，行动有嘉赏。",
  tuan_trans:"习坎，重重险难。水流而不盈溢，行于险中而不失其信。维心亨，乃以刚中也。行有尚，往有功也。天险不可升，地险是山川丘陵。王公设险以守国，坎之时用大矣哉！",
  xiang_trans:"水流接连而来，象征重重险难。君子以此常行德行，学习教化。",
  yaoci_trans:[
    {position:1, text_trans:"在重重险难中，掉入坑穴，凶险。", xiang_trans:"习坎入坎，迷失了道路而凶险。"},
    {position:2, text_trans:"坎坑有险，只能求取小的收获。", xiang_trans:"求取小的收获，尚未脱离中间。"},
    {position:3, text_trans:"来了又是坎险，险而又险，只好先停下来，掉入坑穴中。不要这样做。", xiang_trans:"来了又是坎，终究没有功绩。"},
    {position:4, text_trans:"一壶酒两碗饭，用简陋的瓦器盛放，通过窗户递进去。终究没有灾祸。", xiang_trans:"一壶酒两碗饭，刚柔相交之际。"},
    {position:5, text_trans:"坎水尚未盈满，但已达到平齐，没有灾祸。", xiang_trans:"坎水未盈满，居中而未到大的地步。"},
    {position:6, text_trans:"被绳索捆绑，囚禁在荆棘丛中，三年不能脱困。凶险。", xiang_trans:"上六失道，凶险持续三年。"}
  ]},
// #30 离
{id:30, guaci_trans:"利于坚守正道，亨通。畜养母牛则吉祥。",
  tuan_trans:"离卦，附丽之意。日月附丽于天，百谷草木附丽于地。重明以丽乎正，乃化成天下。柔丽乎中正，故亨。所以畜牝牛吉也。",
  xiang_trans:"明亮的光芒接连升起，象征附丽。大人以此接续光明照耀四方。",
  yaoci_trans:[
    {position:1, text_trans:"恭敬地行走交错而来，没有灾祸。", xiang_trans:"恭敬行走交错，以此避免灾祸。"},
    {position:2, text_trans:"黄色的附丽，大吉。", xiang_trans:"黄色附丽大吉，得中道。"},
    {position:3, text_trans:"夕阳西下时的附丽，如果不敲缶而歌，就会有老人的叹息。凶险。", xiang_trans:"夕阳附丽，怎能长久呢？"},
    {position:4, text_trans:"突如其来地，焚烧、死亡、抛弃。", xiang_trans:"突如其来，没有人容纳。"},
    {position:5, text_trans:"流泪涟涟，忧伤叹息，吉祥。", xiang_trans:"六五之吉，附丽于王公。"},
    {position:6, text_trans:"天子出征讨伐，嘉奖是斩杀首领。所捕获的不是同类，没有灾祸。", xiang_trans:"天子以此出征，以正邦国。"}
  ]},
// #31 咸
{id:31, guaci_trans:"亨通，利于坚守正道。娶女吉祥。",
  tuan_trans:"咸卦，感应也。柔上而刚下，二气感应以相与。止而悦，男下女，所以亨利贞取女吉。天地感而万物化生，圣人感人心而天下和平。观其所感，天地万物之情可见矣。",
  xiang_trans:"山上有泽，象征感应。君子以虚心接纳他人。",
  yaoci_trans:[
    {position:1, text_trans:"感应到脚拇指。", xiang_trans:"感应脚拇指，志在于外。"},
    {position:2, text_trans:"感应到小腿肚，凶险。安居则吉祥。", xiang_trans:"虽然凶险，安居则吉，顺从则不受害。"},
    {position:3, text_trans:"感应到大腿，抱持其所追随的。前往有困辱。", xiang_trans:"感应到大腿，也是未能安处。志在追随他人，所执持的是下面的。"},
    {position:4, text_trans:"坚守正道则吉祥，悔恨消亡。心思不定地往来，朋友只是追随你的思想。", xiang_trans:"贞吉悔亡，尚未感到有害。心思往来，尚未光大。"},
    {position:5, text_trans:"感应到后背的肉，没有悔恨。", xiang_trans:"感应后背的肉，志向到了末端。"},
    {position:6, text_trans:"感应到面颊、舌头。", xiang_trans:"感应面颊舌头，是用口舌来表达。"}
  ]},
// #32 恒
{id:32, guaci_trans:"亨通，没有灾祸，利于坚守正道。利于有所前往。",
  tuan_trans:"恒卦，长久之意。刚上而柔下。雷风相与，巽而动，刚柔皆应，就是恒。恒亨无灾利贞，是因为久于其道。天地之道恒久而不已。利有攸往，终则有始。日月得天而能久照，四时变化而能久成。圣人久于其道而天下化成。观其所恒，天地万物之情可见矣。",
  xiang_trans: "雷风相合，象征恒久。君子以此不改变方向立场。",
  yaoci_trans:[
    {position:1, text_trans:"深求恒久之道，坚守正道有凶，没有利处。", xiang_trans:"深求恒久之凶，始即求深。"},
    {position:2, text_trans:"悔恨消亡。", xiang_trans:"九二悔亡，能久居中道。"},
    {position:3, text_trans:"不能持久地保持德行，或许承受羞耻。坚守正道有困辱。", xiang_trans:"不能持久保持德行，无所容纳。"},
    {position:4, text_trans:"田野中没有猎物。", xiang_trans:"久处非位，怎能获得猎物？"},
    {position:5, text_trans:"持久地坚守德行，对妇人来说坚守正道则吉，对丈夫来说坚守正道则凶。", xiang_trans:"妇人贞吉，从一而终。丈夫制义，顺从妇人则凶。"},
    {position:6, text_trans:"振动不安地求恒久，凶险。", xiang_trans:"振动不安地在上位，大无功绩。"}
  ]},
// #33-64 精简译文
// #33 遁
{id:33, guaci_trans:"亨通，退避之时小事利于坚守正道。",
  tuan_trans:"遁亨，遁而亨也。刚当位而应，与时行也。小利贞，浸而长也。遁之时义大矣哉！",
  xiang_trans:"天下有山，象征退避。君子以此远离小人，不用厌恶而是保持威严。",
  yaoci_trans:[
    {position:1, text_trans:"退避时落在后面，有危险。不要有所前往。", xiang_trans:"退避落后之危险，不前往有何灾呢？"},
    {position:2, text_trans:"用黄牛皮绳捆绑，没有人能解脱。", xiang_trans:"用黄牛固守，志向坚固。"},
    {position:3, text_trans:"系累的退避，有疾病和危险。畜养臣仆婢妾则吉。", xiang_trans:"系累退避之危险，有疾而疲惫。畜养臣妾吉，不可大事。"},
    {position:4, text_trans:"好的退避，君子吉祥，小人否闭。", xiang_trans:"君子好遁，小人否塞。"},
    {position:5, text_trans:"嘉美的退避，坚守正道则吉祥。", xiang_trans:"嘉遁贞吉，以正志也。"},
    {position:6, text_trans:"肥遁，丰裕的退避，没有不利。", xiang_trans:"肥遁无不利，无所疑也。"}
  ]},
// #34 大壮
{id:34, guaci_trans:"利于坚守正道。",
  tuan_trans:"大壮，大者壮也。刚以动，故壮。大壮利贞，大者正也。正大而天地之情可见矣。",
  xiang_trans:"雷在天上，象征大壮。君子以此非礼勿履。",
  yaoci_trans:[
    {position:1, text_trans:"壮盛在脚趾上，出征则凶，有诚信。", xiang_trans:"壮在趾，其诚信必穷困。"},
    {position:2, text_trans:"坚守正道则吉祥。", xiang_trans:"九二贞吉，以居中也。"},
    {position:3, text_trans:"小人用壮力，君子不用。坚守正道有危险。公羊用角顶篱笆，角被缠住。", xiang_trans:"小人用壮，君子则不用。"},
    {position:4, text_trans:"坚守正道则吉祥，悔恨消亡。篱笆打开了，公羊角没有被缠住。大车的车轴坚壮。", xiang_trans:"篱笆打开角未缠住，还在前进。"},
    {position:5, text_trans:"在易地失去羊，没有悔恨。", xiang_trans:"在易地失羊，位置不恰当。"},
    {position:6, text_trans:"公羊用角顶篱笆，进退不得。没有利处，但艰难之后则吉祥。", xiang_trans:"进退不得，不详察也。艰则吉，灾祸不会长久。"}
  ]},
// #35 晋
{id:35, guaci_trans:"康侯用天子赏赐的马匹，繁殖众多，一天之内三次受到接见。",
  tuan_trans:"晋，进也。明出地上，顺而丽乎大明。柔进而上行，所以康侯用锡马蕃庶，昼日三接也。",
  xiang_trans:"明出地上，象征晋升。君子以此自己彰明美德。",
  yaoci_trans:[
    {position:1, text_trans:"想要前进又被阻退，坚守正道则吉祥。不受信任，从容不迫则没有灾祸。", xiang_trans:"前进被阻退，独行正道。从容则无灾，尚未受命。"},
    {position:2, text_trans:"想要前进而忧愁，坚守正道则吉祥。受到这般大的福泽，来自祖母。", xiang_trans:"受到大福泽，以居中得正。"},
    {position:3, text_trans:"众人信任，悔恨消亡。", xiang_trans:"众人信任，志向上行。"},
    {position:4, text_trans:"前进像大鼠一样，坚守正道有危险。", xiang_trans:"鼫鼠般贞厉，位置不当。"},
    {position:5, text_trans:"悔恨消亡，不计较得失。前往吉祥，没有不利。", xiang_trans:"不计较得失之吉，前往有喜庆。"},
    {position:6, text_trans:"用角去攻击，只利于攻伐邑内，有危险但吉祥，没有灾祸。坚守正道有困辱。", xiang_trans:"只利于攻伐邑内，道未光大。"}
  ]},
// #36 明夷
{id:36, guaci_trans:"利于在艰难中坚守正道。",
  tuan_trans:"明入地中，明夷。内文明而外柔顺，以蒙受大难。文王以之。利艰贞，晦其明也。内难而能正其志。箕子以之。",
  xiang_trans:"明入地中，象征光明受损。君子以此治理民众，用晦暗来显现光明。",
  yaoci_trans:[
    {position:1, text_trans:"光明受伤而飞行，垂下翅膀。君子出行，三天不进食。有所前往，主人有话说。", xiang_trans:"君子出行，义不食也。"},
    {position:2, text_trans:"光明受伤，伤了左腿。用壮马来救援，吉祥。", xiang_trans:"六二之吉，顺以则也。"},
    {position:3, text_trans:"光明受伤而在南方狩猎，获得大首领。不可操之过急地坚守正道。", xiang_trans:"南狩之志，乃大得也。"},
    {position:4, text_trans:"进入到左腹之中，获得光明受伤的心意，于门庭出走。", xiang_trans:"入于左腹，获得心意。"},
    {position:5, text_trans:"箕子的光明受伤，利于坚守正道。", xiang_trans:"箕子之贞，明不可灭。"},
    {position:6, text_trans:"不明亮而是黑暗。先升到天上，后坠入地中。", xiang_trans:"先升天上，照耀四国。后入地中，失去法则。"}
  ]},
// #37 家人
{id:37, guaci_trans:"利于女子坚守正道。",
  tuan_trans:"家人，女正位乎内，男正位乎外。男女正，天地之大义也。家人有严君焉，父母之谓也。父父子子，兄兄弟弟，夫夫妇妇，而家道正。正家而天下定矣。",
  xiang_trans:"风从火出，象征家人。君子言行有实质，行为有恒常。",
  yaoci_trans:[
    {position:1, text_trans:"防闲家中的人，悔恨消亡。", xiang_trans:"防闲家人，志向未改变。"},
    {position:2, text_trans:"没有特别的成就，在家中料理饮食。坚守正道则吉祥。", xiang_trans:"六二之吉，顺从以逊巽。"},
    {position:3, text_trans:"家人严厉地治家，后悔太严厉有危险但吉祥。妇女儿童嘻嘻哈哈，终将有困辱。", xiang_trans:"家人严厉，尚未失正。妇儿嘻笑，丧失家规。"},
    {position:4, text_trans:"使家庭富裕，大吉。", xiang_trans:"富家大吉，顺在位也。"},
    {position:5, text_trans:"天子到达家庙，不必忧虑，吉祥。", xiang_trans:"天子到家庙之吉，以交互相爱。"},
    {position:6, text_trans:"有诚信而威严，终将吉祥。", xiang_trans:"威严之吉，反身自省。"}
  ]},
// #38 睽
{id:38, guaci_trans:"小事吉祥。",
  tuan_trans:"睽卦，火动而上，泽动而下，二女同居其志不同行。说而丽乎明，柔进而上行得中而应乎刚，所以小事吉。天地睽而其事同也，男女睽而其志通也，万物睽而其事类也。睽之时用大矣哉！",
  xiang_trans:"上火下泽，象征乖违。君子以此求同存异。",
  yaoci_trans:[
    {position:1, text_trans:"悔恨消亡。丢失了马不用追赶，它自己会回来。看见恶人，没有灾祸。", xiang_trans:"看见恶人，以避免灾祸。"},
    {position:2, text_trans:"在巷子里遇到主人，没有灾祸。", xiang_trans:"在巷子里遇主人，尚未失道。"},
    {position:3, text_trans:"看到车被拖拉，牛被拖住，那人又被刺了额头割了鼻子。没有好的开始但有好的结局。", xiang_trans:"看到车被拉，位置不当。没有好开始有好结局，遇到刚正之人。"},
    {position:4, text_trans:"乖离孤独，遇到好人。交往有诚信，有危险但没有灾祸。", xiang_trans:"交往有诚信无灾，志向得以实行。"},
    {position:5, text_trans:"悔恨消亡。同宗族的人噬咬肌肤，前往有什么灾祸呢？", xiang_trans:"同族噬肤，前往有喜庆。"},
    {position:6, text_trans:"乖离孤独，看见猪背上有泥，一车的鬼怪。先张弓又放下弓。不是强盗，是来求婚的。前往遇到雨水则吉祥。", xiang_trans:"遇雨之吉，群疑消除。"}
  ]},
// #39 蹇
{id:39, guaci_trans:"利于西南方，不利于东北方。利于拜见大人。坚守正道则吉祥。",
  tuan_trans:"蹇，难也。险在前也。见险而能止，知矣哉！蹇利西南，往得中也。不利东北，其道穷也。利见大人，往有功也。当位贞吉，以正邦也。蹇之时用大矣哉！",
  xiang_trans:"山上有水，象征蹇难。君子以此反省自身来修养德行。",
  yaoci_trans:[
    {position:1, text_trans:"前往有蹇难，返回则有赞誉。", xiang_trans:"前往蹇难返回有赞誉，宜于等待。"},
    {position:2, text_trans:"王臣艰难重重，不是为了自身的缘故。", xiang_trans:"王臣蹇蹇，终究无过失。"},
    {position:3, text_trans:"前往有蹇难，返回而来。", xiang_trans:"前往蹇难返回来，内心欢喜。"},
    {position:4, text_trans:"前往有蹇难，返回而结交。", xiang_trans:"前往蹇难返回结交，恰当其位。"},
    {position:5, text_trans:"大的蹇难，朋友来帮助。", xiang_trans:"大蹇朋来，以居中之德。"},
    {position:6, text_trans:"前往有蹇难，回来则大有收获。吉祥。利于拜见大人。", xiang_trans:"前往蹇难回来大有收获，志向在内。利见大人，以从贵者。"}
  ]},
// #40 解
{id:40, guaci_trans:"利于西南方。没有要去的地方，返回来则吉祥。有要去的地方，早些前往则吉祥。",
  tuan_trans:"解，险以动，动而免乎险，解。解利西南，往得众也。其来复吉，乃得中也。有攸往夙吉，往有功也。天地解而雷雨作，雷雨作而百果草木皆甲坼。解之时义大矣哉！",
  xiang_trans:"雷雨交作，象征解除。君子以此赦免过错，宽恕罪行。",
  yaoci_trans:[
    {position:1, text_trans:"没有灾祸。", xiang_trans:"刚柔之际，义理上没有灾祸。"},
    {position:2, text_trans:"在田猎中获得三只狐狸，得到黄色的箭。坚守正道则吉祥。", xiang_trans:"九二贞吉，得中道。"},
    {position:3, text_trans:"背负着东西又乘坐车辆，招来盗贼。坚守正道有困辱。", xiang_trans:"负且乘，也是可羞耻的。自己招来盗贼，又能怪谁呢？"},
    {position:4, text_trans:"解除你的脚拇指，朋友到来就有诚信。", xiang_trans:"解除脚拇指，尚未恰当其位。"},
    {position:5, text_trans:"君子只有解除束缚才能吉祥。对小人有诚信。", xiang_trans:"君子解除之吉，是因为小人退去。"},
    {position:6, text_trans:"公侯用射箭击中城墙上的猛隼，获得了它。没有不利。", xiang_trans:"公用射隼，以解除叛逆。"}
  ]},
// #41 损
{id:41, guaci_trans:"有诚信，大吉无灾。可以坚守正道。利于有所前往。用什么祭祀？两簋淡饭即可。",
  tuan_trans:"损，损下益上，其道上行。损而有孚，元吉无灾可贞，利有攸往。曷之用？二簋可用享。二簋应有时，损刚益柔有时。损益盈虚，与时偕行。",
  xiang_trans:"山下有泽，象征减损。君子以此克制愤怒，节制欲望。",
  yaoci_trans:[
    {position:1, text_trans:"办完事情赶快去帮助，没有灾祸。酌量减损自己。", xiang_trans:"办完事赶快帮助，合志上行。"},
    {position:2, text_trans:"利于坚守正道。出征则凶。不减损而增益。", xiang_trans:"九二利贞，以居中为志。"},
    {position:3, text_trans:"三人同行则减少一人，一人独行则得到朋友。", xiang_trans:"一人独行，三则疑惑。"},
    {position:4, text_trans:"减损自己的疾病，使人快速前来，有喜事。没有灾祸。", xiang_trans:"减损疾病，也是值得欢喜的。"},
    {position:5, text_trans:"有人增益他十朋之龟，不可违背。大吉。", xiang_trans:"六五大吉，来自上天的保佑。"},
    {position:6, text_trans:"不减损而增益，没有灾祸。坚守正道则吉祥。利于有所前往。得到臣仆但无家室。", xiang_trans:"不损而益，大得志。"}
  ]},
// #42 益
{id:42, guaci_trans:"利于有所前往。利于渡过大河。",
  tuan_trans:"益，损上益下，民说无疆。自上下下，其道大光。利有攸往，中正有庆。利涉大川，木道乃行。益动而巽，日进无疆。天施地生，其益无方。凡益之道，与时偕行。",
  xiang_trans:"风雷交合，象征增益。君子见善则迁，有过则改。",
  yaoci_trans:[
    {position:1, text_trans:"利于做大事，大吉没有灾祸。", xiang_trans:"大吉无灾，下面不做大事也。"},
    {position:2, text_trans:"有人增益他十朋之龟，不可违背。永远坚守正道则吉祥。天子祭祀上帝，吉祥。", xiang_trans:"有人增益，来自外方。"},
    {position:3, text_trans:"因凶事而受益，没有灾祸。有诚信行走在中道，向公侯禀告用圭玉。", xiang_trans:"因凶事受益，固然有之。"},
    {position:4, text_trans:"行走在中道，禀告公侯而依从。利于用作迁都的依据。", xiang_trans:"禀告公侯依从，以增益志向。"},
    {position:5, text_trans:"有诚信施惠于众人，不用问也大吉。有诚信以惠及我的德行。", xiang_trans:"有诚信施惠，不用问也。惠我德，大得志。"},
    {position:6, text_trans:"没有人增益他，反而有人攻击他。立心不恒久，凶险。", xiang_trans:"没有人增益，偏颇之辞。有人攻击，来自外方。"}
  ]},
// #43 夬
{id:43, guaci_trans:"在朝廷上宣扬，有诚信地呼号，有危险。从自己的邑中告诫。不利于动武。利于有所前往。",
  tuan_trans:"夬，决也。刚决柔也。健而说，决而和。扬于王庭，柔乘五刚也。孚号有厉，其危乃光也。告自邑不利即戎，所尚乃穷也。利有攸往，刚长乃终也。",
  xiang_trans:"泽上于天，象征决断。君子以此施禄及下，居德则忌。",
  yaoci_trans:[
    {position:1, text_trans:"脚趾前进壮盛，前往不能取胜就有灾祸。", xiang_trans:"不能取胜而前往，就是灾祸。"},
    {position:2, text_trans:"恐惧地呼号，晚上有敌兵。不必忧虑。", xiang_trans:"有敌兵不忧虑，得中道。"},
    {position:3, text_trans:"壮盛在颧骨上，有凶险。君子果断地决断，独自前行遇到雨水被淋湿，有愤怒但没有灾祸。", xiang_trans:"君子果断决断，终究没有灾祸。"},
    {position:4, text_trans:"臀部没有皮肤，行走困难。牵着羊走则悔恨消亡。听到话但不相信。", xiang_trans:"行走困难，位置不当。听话不信，听力不明。"},
    {position:5, text_trans:"像苋菜一样果断决断，行走在中道上没有灾祸。", xiang_trans:"行走中道无灾，居中而未光大。"},
    {position:6, text_trans:"没有呼号，终将有凶险。", xiang_trans:"没有呼号之凶，终究不可长久。"}
  ]},
// #44 姤
{id:44, guaci_trans:"女子壮盛，不宜娶这样的女子。",
  tuan_trans:"姤，遇也。柔遇刚也。勿用取女，不可与长也。天地相遇，品物咸章也。刚遇中正，天下大行也。姤之时义大矣哉！",
  xiang_trans:"天下有风，象征遇合。后以此施命诰四方。",
  yaoci_trans:[
    {position:1, text_trans:"系在金属的车闸上，坚守正道则吉祥。有所前往则有凶。瘦弱的猪挣扎跳跃。", xiang_trans:"系在金属车闸上，柔道牵引。"},
    {position:2, text_trans:"厨房里有鱼，没有灾祸。不利于招待宾客。", xiang_trans:"包有鱼，义不及宾。"},
    {position:3, text_trans:"臀部没有皮肤，行走困难。有危险但没有大的灾祸。", xiang_trans:"行走困难，行动尚未牵引。"},
    {position:4, text_trans:"包裹中没有鱼，起身则有凶。", xiang_trans:"无鱼之凶，远离民众。"},
    {position:5, text_trans:"用杞树叶包裹瓜，含蓄美质，有从天而降的吉兆。", xiang_trans:"九五含蓄，居中得正。有从天降的，志向不舍弃天命。"},
    {position:6, text_trans:"遇合到角上，有困辱但没有灾祸。", xiang_trans:"遇合到角上，上面已穷尽而有困辱。"}
  ]},
// #45 萃
{id:45, guaci_trans:"亨通。天子到达宗庙。利于拜见大人，亨通。利于坚守正道。用大牲畜祭祀则吉祥。利于有所前往。",
  tuan_trans:"萃，聚也。顺以说，刚中而应，故聚也。王假有庙，致孝享也。利见大人亨，聚以正也。用大牲吉利有攸往，顺天命也。观其所聚，而天地万物之情可见矣。",
  xiang_trans:"泽上于地，象征聚合。君子以此修整兵器，戒备意外。",
  yaoci_trans:[
    {position:1, text_trans:"有诚信但未能坚持到底，混乱而又聚集。呼号求助，一握之间就转忧为笑。不必忧虑，前往没有灾祸。", xiang_trans:"混乱聚集，志向不明。"},
    {position:2, text_trans:"被引导则吉祥，没有灾祸。有诚信则利于举行春祭。", xiang_trans:"引导之吉无灾，居中而不变。"},
    {position:3, text_trans:"聚集而叹息，没有利处。前往没有灾祸，稍有困辱。", xiang_trans:"前往无灾，上面逊顺。"},
    {position:4, text_trans:"大吉则没有灾祸。", xiang_trans:"大吉无灾，位置不当。"},
    {position:5, text_trans:"聚合有其位，没有灾祸。不信服的人，要有大通顺利的永久坚守正道，则悔恨消亡。", xiang_trans:"聚合有其位，志向未光明。"},
    {position:6, text_trans:"赍咨嗟叹流涕，没有灾祸。", xiang_trans:"赍咨涕洟，尚未安宁。"}
  ]},
// #46 升
{id:46, guaci_trans:"大通顺利，用来拜见大人，不必忧虑。向南方出征则吉祥。",
  tuan_trans:"柔以时升，巽而顺，刚中而应，是以大亨。用见大人勿恤，有庆也。南征吉，志行也。",
  xiang_trans:"地中生木，象征上升。君子以此顺从德行，积累细小以成高大。",
  yaoci_trans:[
    {position:1, text_trans:"允许上升，大吉。", xiang_trans:"允升大吉，上面合志。"},
    {position:2, text_trans:"有诚信则利于举行春祭，没有灾祸。", xiang_trans:"九二有诚信，有喜事。"},
    {position:3, text_trans:"上升到空虚的邑。", xiang_trans:"升虚邑，无所疑也。"},
    {position:4, text_trans:"天子在岐山祭祀，吉祥，没有灾祸。", xiang_trans:"天子岐山祭祀，顺事也。"},
    {position:5, text_trans:"坚守正道则吉祥，升阶而上。", xiang_trans:"贞吉升阶，大得志。"},
    {position:6, text_trans:"在昏暗中上升，利于不停地坚守正道。", xiang_trans:"冥升在上，消耗而不富裕。"}
  ]},
// #47 困
{id:47, guaci_trans:"亨通，坚守正道。大人吉祥，没有灾祸。有话要说却不被信任。",
  tuan_trans:"困，刚掩也。险以说，困而不失其所亨，其唯君子乎。贞大人吉，以刚中也。有言不信，尚口乃穷也。",
  xiang_trans:"泽中无水，象征困穷。君子以此舍命成就志向。",
  yaoci_trans:[
    {position:1, text_trans:"臀部坐困在木桩上，进入幽暗的山谷，三年见不到人。", xiang_trans:"进入幽谷，幽暗不明。"},
    {position:2, text_trans:"在酒食中受困。朱红色的蔽膝前来，利于祭祀。出征则凶，没有灾祸。", xiang_trans:"在酒食中受困，居中有庆。"},
    {position:3, text_trans:"被石头困住，靠着蒺藜。进入室内看不到妻子，凶。", xiang_trans:"靠着蒺藜，乘刚也。进入室内不见妻子，不吉祥。"},
    {position:4, text_trans:"来得很慢，被金车困住。有困辱但有终。", xiang_trans:"来得很慢，志向在下面。虽然不当位，有同伴。"},
    {position:5, text_trans:"被割鼻削足，被朱红色蔽膝所困。缓缓地有所悦，利于祭祀。", xiang_trans:"割鼻削足，志向未得。缓缓有悦，以居中正。利于祭祀，受福也。"},
    {position:6, text_trans:"被藤蔓困住，处于危险摇晃中。说动则有悔。有悔就出征，吉祥。", xiang_trans:"被藤蔓困住，尚未恰当。动有悔，吉祥则行。"}
  ]},
// #48 井
{id:48, guaci_trans:"改变城邑不改变井。不丧失也不获得，来来往往都从井中汲水。将要汲到时却弄破了水瓶，凶险。",
  tuan_trans:"巽乎水而上水，井。井养而不穷也。改邑不改井，乃以刚中也。汔至亦未繘井，未有功也。羸其瓶，是以凶也。",
  xiang_trans:"木上有水，象征井。君子以此勉励民众互相帮助。",
  yaoci_trans:[
    {position:1, text_trans:"井底的泥不能食用，旧井没有禽鸟来栖息。", xiang_trans:"井底泥不食，是在下面。旧井无禽，是被时代遗弃。"},
    {position:2, text_trans:"井中的鲋鱼可射，水瓮破漏。", xiang_trans:"井中射鲋，没有同伴相应。"},
    {position:3, text_trans:"井已清洁却不被饮用，使我心悲。可以汲来使用。天子明察，大家都能受福。", xiang_trans:"井洁不食，行为可惜。求天子明察，受福也。"},
    {position:4, text_trans:"用砖砌井壁，没有灾祸。", xiang_trans:"井砌砖壁，修缮井邑。"},
    {position:5, text_trans:"井水清洁甘冽，可以饮用。", xiang_trans:"寒泉之食，居中正也。"},
    {position:6, text_trans:"从井中汲水，不要遮盖。有诚信，大吉。", xiang_trans:"大吉在上，大有成就。"}
  ]},
// #49 革
{id:49, guaci_trans:"到了巳日才有信任，大通顺利，利于坚守正道。悔恨消亡。",
  tuan_trans:"革，水火相息，二女同居其志不相得，曰革。巳日乃孚，革而信之。文明以悦，大亨以正。革而当，其悔乃亡。天地革而四时成，汤武革命顺乎天而应乎人。革之时义大矣哉！",
  xiang_trans:"泽中有火，象征变革。君子以此制定历法，明确时令。",
  yaoci_trans:[
    {position:1, text_trans:"用黄牛的皮革加以巩固。", xiang_trans:"用黄牛巩固，不可以有所作为。"},
    {position:2, text_trans:"到了巳日就进行变革，出征则吉祥，没有灾祸。", xiang_trans:"巳日革之，行而有嘉。"},
    {position:3, text_trans:"出征则凶，坚守正道有危险。变革的言论再三提出，就有信任。", xiang_trans:"变革言论再三，又有何为？"},
    {position:4, text_trans:"悔恨消亡，有诚信改变天命则吉祥。", xiang_trans:"改命之吉，信志也。"},
    {position:5, text_trans:"大人如虎般变革，不用占卜就有信任。", xiang_trans:"大人虎变，其文炳也。"},
    {position:6, text_trans:"君子如豹般变革，小人面貌改变。出征则凶。安居坚守正道则吉祥。", xiang_trans:"君子豹变，其文蔚也。小人革面，顺以从君。"}
  ]},
// #50 鼎
{id:50, guaci_trans:"大吉，亨通。",
  tuan_trans:"鼎，象也。以木巽火，烹饪也。圣人烹饪以享上帝，而大烹以养圣贤。巽而耳目聪明，柔进而上行得中而应乎刚，是以元亨。",
  xiang_trans:"木上有火，象征鼎。君子以此端正位置，凝聚天命。",
  yaoci_trans:[
    {position:1, text_trans:"鼎翻倒了脚，利于清除糟粕。娶妾以得到她的儿子，没有灾祸。", xiang_trans:"鼎翻脚，未算违逆。利于出糟粕，以从贵也。"},
    {position:2, text_trans:"鼎中有食物，我的同伴有妒忌，但不能伤害我。吉祥。", xiang_trans:"鼎有食物，谨慎所行。我有同伴妒忌，终究无过错。"},
    {position:3, text_trans:"鼎的两耳变形了，行动受阻。野鸡的肥美汤汁不能食用。等到天降甘雨则悔恨消亡，终将吉祥。", xiang_trans:"鼎耳变形，失去了功用。"},
    {position:4, text_trans:"鼎的脚折断了，倾覆了公侯的美食，弄得汁液满地，凶险。", xiang_trans:"倾覆公食，何以信任呢？"},
    {position:5, text_trans:"鼎有黄色的耳朵和金色的铉，利于坚守正道。", xiang_trans:"鼎黄耳，居中以为实。"},
    {position:6, text_trans:"鼎有玉铉，大吉，没有不利。", xiang_trans:"玉铉在上，刚柔相济。"}
  ]},
// #51 震
{id:51, guaci_trans:"亨通。雷声到来令人恐惧，说笑自若。雷声震惊百里，而手中的匕和鬯酒不掉落。",
  tuan_trans:"震亨。震来虩虩，恐致福也。笑言哑哑，后有则也。震惊百里，惊远而惧迩也。出可以守宗庙社稷，以为祭主也。",
  xiang_trans:"雷声接连而来，象征震动。君子以此恐惧修省。",
  yaoci_trans:[
    {position:1, text_trans:"雷声到来使人恐惧，随后说笑自若，吉祥。", xiang_trans:"雷来恐惧，恐惧致福。笑言哑哑，后有法则。"},
    {position:2, text_trans:"雷声到来很危险。估计会丢失贝币，登上九层高山。不用追寻，七天就能找回。", xiang_trans:"雷来危险，乘刚也。"},
    {position:3, text_trans:"雷声来袭使人恍惚。因雷震而奋起行动则没有灾祸。", xiang_trans:"雷来恍惚，位置不当。"},
    {position:4, text_trans:"雷声来了却陷入泥中。", xiang_trans:"雷震入泥，尚未有光明。"},
    {position:5, text_trans:"雷声来去都有危险，估计不会有损失。有事情要做。", xiang_trans:"雷声来去都危险，危险行于中。其事在中，大无丧失。"},
    {position:6, text_trans:"雷声使人索然无力，心神不安地四处张望。出征则凶。雷声不到自己身上而到邻居身上，没有灾祸。婚姻之事有话要说。", xiang_trans:"雷声使人索然，居中而未得。虽然凶险，对邻居没有灾祸，因为有所警惧。"}
  ]},
// #52 艮
{id:52, guaci_trans:"止于背部，感觉不到自己的身体。行走在庭院中，看不到人，没有灾祸。",
  tuan_trans:"艮，止也。时止则止，时行则行，动静不失其时，其道光明。艮其止，止其所也。上下敌应，不相与也。是以不获其身，行其庭不见其人，无灾也。",
  xiang_trans:"两山并立，象征止。君子以此思虑不出其位。",
  yaoci_trans:[
    {position:1, text_trans:"止于脚趾，没有灾祸。利于永远坚守正道。", xiang_trans:"止于脚趾，未失正道。"},
    {position:2, text_trans:"止于小腿，不能拯救所追随的，心中不快乐。", xiang_trans:"不能拯救所随，尚未退而听从。"},
    {position:3, text_trans:"止于腰部，裂开脊肉，危险有如烈火焚心。", xiang_trans:"止于腰部之危，心意不安。"},
    {position:4, text_trans:"止于自身，没有灾祸。", xiang_trans:"止于自身，能止于身。"},
    {position:5, text_trans:"止于面颊，言语有次序。悔恨消亡。", xiang_trans:"止于面颊之吉，以居中正。"},
    {position:6, text_trans:"敦厚的止，吉祥。", xiang_trans:"敦厚止之吉，以其敦厚到极致。"}
  ]},
// #53 渐
{id:53, guaci_trans:"女子出嫁吉祥。利于坚守正道。",
  tuan_trans:"渐之进也，女归吉也。进得位，往有功也。进以正，可以正邦也。其位刚得中也。止而巽，动不穷也。",
  xiang_trans:"山上有木，象征渐进。君子以此安居善行改善风俗。",
  yaoci_trans:[
    {position:1, text_trans:"鸿雁渐进到水边，小子有危险，有闲话，没有灾祸。", xiang_trans:"小子之危，义无灾也。"},
    {position:2, text_trans:"鸿雁渐进到磐石上，饮食自得，吉祥。", xiang_trans:"饮食自得之吉，不素饱也。"},
    {position:3, text_trans:"鸿雁渐进到高平之地。丈夫出征不归来，妇女怀孕不养育。凶险。利于抵御盗贼。", xiang_trans:"丈夫出征不归，离开同伴而可丑。妇女怀孕不育，失去正道。利于御盗，顺相保也。"},
    {position:4, text_trans:"鸿雁渐进到树上，或许能找到平坦的栖息之处，没有灾祸。", xiang_trans:"或得其桷，顺从以逊巽。"},
    {position:5, text_trans:"鸿雁渐进到山丘上。妇女三年不孕，终究没有人能克服，吉祥。", xiang_trans:"终究无人能克之吉，得到心愿。"},
    {position:6, text_trans:"鸿雁渐进到高山之上。它的羽毛可以用作仪饰。吉祥。", xiang_trans:"其羽可用为仪，吉，不可乱也。"}
  ]},
// #54 归妹
{id:54, guaci_trans:"出征则凶，没有利处。",
  tuan_trans:"归妹，天地之大义也。天地不交而万物不兴。归妹，人之终始也。说以动，所归妹也。征凶，位不当也。无攸利，柔乘刚也。",
  xiang_trans:"泽上有雷，象征少女出嫁。君子以此知道终究会有弊坏。",
  yaoci_trans:[
    {position:1, text_trans:"少女出嫁为侧室，跛了脚还能走路。出征则吉祥。", xiang_trans:"少女为侧室，以恒常之道。跛能走，相互扶持吉。"},
    {position:2, text_trans:"眇了眼还能看见。利于幽居之人坚守正道。", xiang_trans:"利于幽居之贞，未改变常道。"},
    {position:3, text_trans:"少女出嫁时等待，反回来又以侧室身份出嫁。", xiang_trans:"少女出嫁等待，未当也。"},
    {position:4, text_trans:"少女出嫁延迟了时期，等待时机再出嫁。", xiang_trans:"延期之志，有待而行也。"},
    {position:5, text_trans:"帝乙嫁女儿，那正妻的衣饰不如侧室的华美。月亮将近十五，吉祥。", xiang_trans:"帝乙嫁妹，不如侧室的衣饰。其位居中，以贵为行。"},
    {position:6, text_trans:"女子的筐中没有祭品，士人杀羊没有血。没有利处。", xiang_trans:"上六无实，承着空筐。"}
  ]},
// #55 丰
{id:55, guaci_trans:"亨通，天子亲临，不用忧虑，适宜在日中。",
  tuan_trans:"丰，大也。明以动，故丰。王假之，尚大也。勿忧宜日中，宜照天下也。日中则昃，月盈则食。天地盈虚，与时消息，而况于人乎？况于鬼神乎？",
  xiang_trans:"雷电交至，象征丰盛。君子以此裁断诉讼，施行刑罚。",
  yaoci_trans:[
    {position:1, text_trans:"遇到相配的主人，虽然相等也没有灾祸。前往会得到赞扬。", xiang_trans:"虽然旗鼓相当，超过旬日就有灾。"},
    {position:2, text_trans:"丰大到遮蔽了太阳，日中看到北斗星。前往会得到猜疑和疾病。有诚信以表达，吉祥。", xiang_trans:"有诚信以表达，信以发志也。"},
    {position:3, text_trans:"丰大到遮蔽如帷幕，日中看到小星。折断了右臂，没有灾祸。", xiang_trans:"丰大如帷幕，不可以成大事。折断右臂，终不可用。"},
    {position:4, text_trans:"丰大到遮蔽了太阳，日中看到北斗。遇到夷等的主人，吉祥。", xiang_trans:"丰大遮蔽，位不当也。日中见斗，幽暗不明。遇到夷主，吉祥则行。"},
    {position:5, text_trans:"招来光辉美质，有庆贺和赞誉，吉祥。", xiang_trans:"六五之吉，有庆也。"},
    {position:6, text_trans:"使房屋丰大，用帘幕遮蔽房屋。窥视门庭寂静无人，三年不见人。凶险。", xiang_trans:"丰其屋，天际翱翔。窥其户，阒其无人，自我隐藏。"}
  ]},
// #56 旅
{id:56, guaci_trans:"小有亨通。旅途中坚守正道则吉祥。",
  tuan_trans:"旅，小亨。柔得中乎外而顺乎刚，止而丽乎明，是以小亨旅贞吉也。旅之时义大矣哉！",
  xiang_trans:"山上有火，象征旅行。君子以此明慎用刑，不滞留案件。",
  yaoci_trans:[
    {position:1, text_trans:"旅途中琐琐碎碎，是自取灾祸。", xiang_trans:"旅途琐碎，志向穷困而有灾。"},
    {position:2, text_trans:"旅行到客栈，怀中揣着钱财。得到年轻仆人的忠心。", xiang_trans:"得童仆之贞，终究没有过失。"},
    {position:3, text_trans:"旅行中焚烧了客栈，失去了年轻的仆人。坚守正道有危险。", xiang_trans:"旅焚客栈，也是损害自己。以旅与下面相处，其义理是丧失。"},
    {position:4, text_trans:"旅行到了住所，得到旅资和斧头。我心不快乐。", xiang_trans:"旅于处所，尚未得位。得到旅资斧头，心里尚未快乐。"},
    {position:5, text_trans:"射野鸡，一箭射中。终将有赞誉和授命。", xiang_trans:"终以誉命，是上面逮及。"},
    {position:6, text_trans:"鸟焚烧了它的巢。旅人先笑后嚎啕大哭。在战场上丢失了牛。凶险。", xiang_trans:"以旅在上面，其义焚也。丧牛于易，终究听不到消息。"}
  ]},
// #57 巽
{id:57, guaci_trans:"小有亨通。利于有所前往。利于拜见大人。",
  tuan_trans:"重巽以申命。刚巽乎中正而志行，柔皆顺乎刚，是以小亨。利有攸往，利见大人。",
  xiang_trans:"随风而至，象征巽顺。君子以此申明命令、推行事务。",
  yaoci_trans:[
    {position:1, text_trans:"进退不定，利于武人坚守正道。", xiang_trans:"进退不定，志向疑惑。利于武人之贞，志向治理。"},
    {position:2, text_trans:"巽顺到床下，用巫史来祷告，吉祥，没有灾祸。", xiang_trans:"纷纷而吉，得中也。"},
    {position:3, text_trans:"频频巽顺，有困辱。", xiang_trans:"频频巽顺之辱，志向穷困。"},
    {position:4, text_trans:"悔恨消亡。田猎中获得三种猎物。", xiang_trans:"田获三品，有功也。"},
    {position:5, text_trans:"坚守正道则吉祥，悔恨消亡。没有不利。无好的开头但有好的结局。（变革）前三天后三天，吉祥。", xiang_trans:"九五之吉，位正中。"},
    {position:6, text_trans:"巽顺到床下，丧失了旅资和斧头。坚守正道有凶。", xiang_trans:"巽在床下，上面穷困。丧失旅资斧头，正乎凶也。"}
  ]},
// #58 兑
{id:58, guaci_trans:"亨通，利于坚守正道。",
  tuan_trans:"兑，说也。刚中而柔外，说以利贞，是以顺乎天而应乎人。说以先民，民忘其劳。说以犯难，民忘其死。兑之大，民劝矣哉！",
  xiang_trans:"两泽相连，象征欢悦。君子以此朋友讲习。",
  yaoci_trans:[
    {position:1, text_trans:"和悦地交往，吉祥。", xiang_trans:"和悦交往之吉，行为尚未有可疑。"},
    {position:2, text_trans:"诚信地欢悦，吉祥，悔恨消亡。", xiang_trans:"诚信欢悦之吉，有信任。"},
    {position:3, text_trans:"来取悦人，凶险。", xiang_trans:"来兑之凶，位不当。"},
    {position:4, text_trans:"商量欢悦之事尚未安宁。控制疾病则有喜悦。", xiang_trans:"九四之喜，有庆也。"},
    {position:5, text_trans:"信任于剥蚀的力量，有危险。", xiang_trans:"信任剥蚀，位正当。"},
    {position:6, text_trans:"引导他人来欢悦。", xiang_trans:"上六引兑，尚未有光明。"}
  ]},
// #59 涣
{id:59, guaci_trans:"亨通。天子到达宗庙。利于渡过大河。利于坚守正道。",
  tuan_trans:"涣亨，刚来而不穷，柔得位乎外而上同。王假有庙，王乃在中也。利涉大川，乘木有功也。",
  xiang_trans:"风行水上，象征涣散。先王以此享祀天帝，建立宗庙。",
  yaoci_trans:[
    {position:1, text_trans:"用壮马来拯救，吉祥。", xiang_trans:"初六之吉，顺也。"},
    {position:2, text_trans:"涣散时奔向可倚靠之处，悔恨消亡。", xiang_trans:"涣散奔向倚靠，得到心愿。"},
    {position:3, text_trans:"涣散自身，没有悔恨。", xiang_trans:"涣散自身，志向在外。"},
    {position:4, text_trans:"涣散其群众，大吉。涣散之后有聚集，是常人所想不到的。", xiang_trans:"涣散群众大吉，光大也。"},
    {position:5, text_trans:"涣散时大声号令，如同汗液发散。涣散天子的储备，没有灾祸。", xiang_trans:"天子居正位，没有灾祸。"},
    {position:6, text_trans:"涣散其血液，驱逐恐惧远去。没有灾祸。", xiang_trans:"涣散其血，远离害处。"}
  ]},
// #60 节
{id:60, guaci_trans:"亨通。苦涩的节制不可坚守。",
  tuan_trans:"节亨，刚柔分而刚得中。苦节不可贞，其道穷也。说以行险，当位以节，中正以通。天地节而四时成，节以制度，不伤财不害民。",
  xiang_trans:"泽上有水，象征节制。君子以此制定数度，议论德行。",
  yaoci_trans:[
    {position:1, text_trans:"不出门庭，没有灾祸。", xiang_trans:"不出门庭，知道通达与穷困。"},
    {position:2, text_trans:"不出门庭，凶险。", xiang_trans:"不出门庭之凶，失去了时机。"},
    {position:3, text_trans:"不知节制，就会嗟叹。没有灾祸。", xiang_trans:"不节之嗟，又能怪谁呢？"},
    {position:4, text_trans:"安然地节制，亨通。", xiang_trans:"安然节制之亨，承接上面之道。"},
    {position:5, text_trans:"甘美的节制，吉祥。前往会得到赞誉。", xiang_trans:"甘节之吉，居正位。"},
    {position:6, text_trans:"苦涩的节制，坚守正道有凶。悔恨消亡。", xiang_trans:"苦节贞凶，其道穷尽。"}
  ]},
// #61 中孚
{id:61, guaci_trans:"猪和鱼都吉祥。利于渡过大河。利于坚守正道。",
  tuan_trans:"中孚，柔在内而刚得中，说而巽，孚乃化邦也。豚鱼吉，信及豚鱼也。利涉大川，乘木舟虚也。中孚以利贞，乃应乎天也。",
  xiang_trans:"泽上有风，象征中孚。君子以此议论刑案时缓减死刑。",
  yaoci_trans:[
    {position:1, text_trans:"有所准备则吉祥。另有他想则不安宁。", xiang_trans:"初九虞吉，志向尚未改变。"},
    {position:2, text_trans:"鹤鸣在荫处，它的幼子应和。我有好酒，我与你共享。", xiang_trans:"它的幼子应和，内心的愿望。"},
    {position:3, text_trans:"得到了敌人，或击鼓或停止，或哭泣或歌唱。", xiang_trans:"或鼓或罢，位置不当。"},
    {position:4, text_trans:"月亮将近满月，一匹马走失了同伴，没有灾祸。", xiang_trans:"马匹走失同伴，断绝同类而上行。"},
    {position:5, text_trans:"有诚信紧密联结，没有灾祸。", xiang_trans:"有诚信紧密联结，位正当。"},
    {position:6, text_trans:"鸡的声音向上达到天空，坚守正道有凶。", xiang_trans:"鸡声达天，怎能长久呢？"}
  ]},
// #62 小过
{id:62, guaci_trans:"亨通，利于坚守正道。可以做小事，不可做大事。飞鸟留下声音，不宜上升而宜下降，大吉。",
  tuan_trans:"小过，小者过而亨也。过以利贞，与时行也。柔得中，是以小事吉也。刚失位而不中，是以不可大事也。有飞鸟之象焉，飞鸟遗之音，不宜上宜下大吉，上逆而下顺也。",
  xiang_trans:"山上有雷，象征小过。君子以此行为过于恭敬，丧事过于悲伤，用度过于节俭。",
  yaoci_trans:[
    {position:1, text_trans:"飞鸟飞来有凶。", xiang_trans:"飞鸟凶，不可如何也。"},
    {position:2, text_trans:"经过祖父遇到祖母，没有到达国君而遇到臣子。没有灾祸。", xiang_trans:"不到达国君，臣子不可过也。"},
    {position:3, text_trans:"不过分防备它，有人跟从而伤害了它。凶险。", xiang_trans:"有人跟从伤害，凶险可知。"},
    {position:4, text_trans:"没有灾祸。不过分而遇合它。前往有危险，必须戒备。不要永远这样坚守。", xiang_trans:"不过分遇合，位置恰当。前往厉必戒，终不可长久。"},
    {position:5, text_trans:"密云从我的西郊飘来却不下雨。公侯射中穴中之猎物。", xiang_trans:"密云不雨，已经上升。"},
    {position:6, text_trans:"不遇合而过分了，飞鸟远离。凶险。这就是灾祸。", xiang_trans:"不遇合而过分，已经过于亢极。"}
  ]},
// #63 既济
{id:63, guaci_trans:"亨通但微小。利于坚守正道。开始吉祥，结局混乱。",
  tuan_trans:"既济亨，小者亨也。利贞，刚柔正而位当也。初吉，柔得中也。终止则乱，其道穷也。",
  xiang_trans:"水在火上，象征既济。君子以此思虑患难而预先防备。",
  yaoci_trans:[
    {position:1, text_trans:"拖住车轮，浸湿了尾巴，没有灾祸。", xiang_trans:"拖住车轮，义无灾也。"},
    {position:2, text_trans:"妇人丢失了头巾，不用追寻，七天就能找回。", xiang_trans:"七天找回，以居中道。"},
    {position:3, text_trans:"高宗讨伐鬼方，三年才克服。小人不可用。", xiang_trans:"三年克之，疲惫也。"},
    {position:4, text_trans:"华美的衣服变成破烂的衣服。整天警惕。", xiang_trans:"整天警惕，有所疑虑。"},
    {position:5, text_trans:"东邻杀牛祭祀，不如西邻简朴的祭祀，实实在在地受到福佑。", xiang_trans:"东邻杀牛，不如西邻之时。实受其福，吉大来也。"},
    {position:6, text_trans:"浸湿了头部，有危险。", xiang_trans:"浸湿头部有危险，怎能长久呢？"}
  ]},
// #64 未济
{id:64, guaci_trans:"亨通。小狐狸将要渡过河，却弄湿了尾巴。没有利处。",
  tuan_trans:"未济亨，柔得中也。小狐汔济，未出中也。濡其尾无攸利，不续终也。虽不当位，刚柔应也。",
  xiang_trans:"火在水上，象征未济。君子以此谨慎辨别事物，使其各居其位。",
  yaoci_trans:[
    {position:1, text_trans:"浸湿了尾巴，有困辱。", xiang_trans:"浸湿尾巴，也不知道极限。"},
    {position:2, text_trans:"拖住车轮，坚守正道则吉祥。", xiang_trans:"九二贞吉，居中以行正。"},
    {position:3, text_trans:"尚未完成，出征则凶。利于渡过大河。", xiang_trans:"未济征凶，位不当。"},
    {position:4, text_trans:"坚守正道则吉祥，悔恨消亡。用震动讨伐鬼方，三年后有赏赐于大国。", xiang_trans:"贞吉悔亡，志向得行。"},
    {position:5, text_trans:"坚守正道则吉祥，没有悔恨。君子的光辉，有诚信则吉祥。", xiang_trans:"君子之光，其光辉照耀则吉。"},
    {position:6, text_trans:"有诚信地饮酒，没有灾祸。浸湿了头部，有诚信也会丧失。", xiang_trans:"饮酒濡首，也不知道节制。"}
  ]}
];

// Write each translation to a separate JSON file
let count = 0;
for (const t of translations) {
  const filename = String(t.id).padStart(3, '0') + '.json';
  const filePath = path.join(OUT_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(t, null, 2), 'utf-8');
  count++;
}

console.log(`Generated ${count} translation files in ${OUT_DIR}`);
