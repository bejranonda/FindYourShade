/**
 * Thai Political Shade Quiz
 * Find your political color in Thai politics
 */

// ============================================
// Data Definitions
// ============================================

const categories = {
    NAM_MAK: {
        id: 'NAM_MAK',
        name: 'แดงน้ำหมาก',
        icon: '🥊',
        colorClass: 'bg-red-700',
        textClass: 'text-red-800',
        desc: 'คุณคือตำนาน! นักสู้ผู้ผ่านร้อนผ่านหนาว รักใครรักจริง เกลียดใครเกลียดเข้ากระดูกดำ พร้อมบวกทุกสถาบันเพื่ออุดมการณ์ ฟังเพลงเพื่อชีวิต และเชื่อมั่นใน "นาย" อย่างสุดหัวใจ ไม่สนใจวาทกรรมสวยหรู เน้นใจแลกใจ!'
    },
    NOM_PHONG: {
        id: 'NOM_PHONG',
        name: 'แดงนมผง',
        icon: '🍼',
        colorClass: 'bg-pink-500',
        textClass: 'text-pink-600',
        desc: 'คุณคือคนรุ่นใหม่ที่เติบโตมากับประวัติศาสตร์ เน้นวิเคราะห์โครงสร้าง ใช้เหตุผล (แต่ก็พร้อมด่ากราดในทวิตเตอร์/X) เข้าใจโลกยุคใหม่แต่ใจยังรักสีแดง แสวงหาจุดร่วม สงวนจุดต่าง พยายามจะเป็นสะพานเชื่อมรุ่น'
    },
    MADAM: {
        id: 'MADAM',
        name: 'แดงมาดาม',
        icon: '🍷',
        colorClass: 'bg-red-500',
        textClass: 'text-red-600',
        desc: 'สายซัพพอร์ตเกรดพรีเมียม! ชูนิ้วในห้องแอร์ จิบไวน์ดูข่าวการเมือง ชอบความสง่างาม ไม่เน้นลงถนนให้ร้อนหน้า แต่พร้อมโอนไวถ้าใจสั่งมา เน้นความประนีประนอมแบบผู้ดี และเชื่อในการดีลที่ชาญฉลาด'
    },
    DARA: {
        id: 'DARA',
        name: 'แดงดารา/เซเลบ',
        icon: '✨',
        colorClass: 'bg-purple-600',
        textClass: 'text-purple-600',
        desc: 'สปอตไลท์ต้องส่องที่ฉัน! การเมืองคือเวทีแฟชั่น คุณมีวาทะศิลป์เป็นเลิศ โพสต์ทีไรยอดไลก์กระจุย ชอบเป็นผู้นำเทรนด์ อินเนอร์แรง แอกติ้งเลิศ พร้อมเป็นกระบอกเสียง(ที่ดังกว่าคนอื่น) บางทีก็เน้นซีนมากกว่าเนื้อหา'
    },
    ORANGE: {
        id: 'ORANGE',
        name: 'ส้ม (แอบเนียน)',
        icon: '🍊',
        colorClass: 'bg-orange-500',
        textClass: 'text-orange-500',
        desc: 'เอ๊ะ... จริงๆ คุณอาจจะไม่ใช่แดงแท้! คุณต้องการรื้อโครงสร้าง ปฏิรูปทุกสิ่งอย่าง บางทีก็หงุดหงิดกับวิธีคิดแบบเดิมๆ เน้นพุ่งชนเพดาน จนบางทีเพื่อนสีแดงก็มองค้อน คุณเชื่อในหลักการมากกว่าตัวบุคคล'
    },
    BLUE: {
        id: 'BLUE',
        name: 'น้ำเงิน (สายดีล)',
        icon: '🔵',
        colorClass: 'bg-blue-600',
        textClass: 'text-blue-700',
        desc: 'เน้นกินรวบ... เอ้ย เน้นอยู่เป็น! คุณไม่ชอบความขัดแย้งที่รุนแรง เน้นผลประโยชน์ลงตัว สบายๆ สไตล์ภูมิใจ...ในตัวเอง ใครเป็นรัฐบาลก็ได้ขอให้ฉันได้ดูแลกระทรวงเกรดเอ อุดมการณ์กินไม่ได้ แต่กัญ...เอ้ย การงานมั่นคงกินได้'
    },
    SKY_BLUE: {
        id: 'SKY_BLUE',
        name: 'ฟ้า (ประชาธิปัตย์)',
        icon: '🌩️',
        colorClass: 'bg-sky-400',
        textClass: 'text-sky-600',
        desc: 'สุภาพบุรุษนักการเมือง! คุณเชื่อมั่นในระบบรัฐสภาและกฎหมาย (แม้จะแพ้โหวตตลอด) พูดจาหลักการดูดี แต่บางทีก็ช้าไม่ทันใจวัยรุ่น เกลียดการซื้อเสียงและการโกง (แต่ก็เกลียดพวกล้มเจ้ามากกว่า) เน้นความเก๋าเกมและความเป็นสถาบันการเมือง'
    },
    ORANGE_ACADEMIC: {
        id: 'ORANGE_ACADEMIC',
        name: 'ส้มวิชาการ',
        icon: '🍊👓',
        colorClass: 'bg-orange-400',
        textClass: 'text-orange-700',
        desc: 'คุณคือมันสมองของขบวนการ! เน้นข้อมูล สถิติ และโครงสร้างรัฐสวัสดิการแบบกลุ่มนอร์ดิก อธิบายเก่ง พูดจาฉะฉานด้วย Logic ล้วนๆ ไม่เน้นดราม่า แต่เน้นแก้ที่ต้นตอของปัญหาจริงๆ บางทีอาจดูเข้าถึงยากสำหรับชาวบ้าน'
    },
    ORANGE_FAN: {
        id: 'ORANGE_FAN',
        name: 'ส้มแบก/ด้อม',
        icon: '🧡🔥',
        colorClass: 'bg-orange-600',
        textClass: 'text-orange-500',
        desc: 'รักพ่อ เจ็บแทนพ่อ! พร้อมบวกทุกคนที่มาแตะต้องพรรคหรือผู้นำจิตวิญญาณ พลังงานล้นเหลือในโลกโซเชียล พร้อมแชร์ พร้อมปั่น พร้อมปกป้อง มองว่าพรรคคือความหวังเดียวของประเทศ ใครเห็นต่างคือสลิ่ม!'
    },
    YELLOW_CLASSIC: {
        id: 'YELLOW_CLASSIC',
        name: 'เหลืองคลาสสิก (คนดี)',
        icon: '🎗️',
        colorClass: 'bg-yellow-400',
        textClass: 'text-yellow-700',
        desc: 'เกลียดการโกงเป็นชีวิตจิตใจ! เชื่อว่า "คนดี" เท่านั้นที่ควรปกครองบ้านเมือง เกลียดนักการเมืองคอร์รัปชัน ยึดมั่นในศีลธรรม จริยธรรม และความสงบเรียบร้อย ชอบเป่านกหวีด... เอ้ย ชอบแสดงพลังต้านโกง'
    },
    YELLOW_ROYALIST: {
        id: 'YELLOW_ROYALIST',
        name: 'เหลืองสถาบัน',
        icon: '👑',
        colorClass: 'bg-yellow-600',
        textClass: 'text-yellow-900',
        desc: 'ชาติ ศาสน์ กษัตริย์ คือลมหายใจ! คุณพร้อมปกป้องสถาบันหลักด้วยชีวิต ไม่ยอมให้ใครมาดูหมิ่น ยึดมั่นในขนบธรรมเนียมประเพณีอันดีงาม เชื่อว่ารักษาสิ่งเก่าไว้ดีที่สุดแล้ว การเปลี่ยนแปลงเร็วเกินไปคือหายนะ'
    },
    GREEN: {
        id: 'GREEN',
        name: 'เขียว (ลายพราง)',
        icon: '🪖',
        colorClass: 'bg-green-700',
        textClass: 'text-green-800',
        desc: 'ความสงบจบที่ลุง! ชอบความเด็ดขาด ระเบียบวินัย และความมั่นคง มองว่านักการเมืองมีแต่สร้างปัญหา ต้องให้ทหารมาดูแลถึงจะเรียบร้อย เชื่อฟังผู้นำ ชาติพ้นภัย ไม่ชอบความวุ่นวายของการชุมนุม'
    },
    WHITE: {
        id: 'WHITE',
        name: 'ขาว (พลังเงียบ)',
        icon: '🏳️',
        colorClass: 'bg-gray-400',
        textClass: 'text-gray-600',
        desc: 'การเมืองน่าเบื่อ... ขอทำมาหากินดีกว่า! คุณไม่ได้อินกับสีไหนเป็นพิเศษ ใครเป็นรัฐบาลก็ต้องตื่นไปทำงานอยู่ดี มองว่าทุกฝ่ายก็มีทั้งคนดีและคนเลว เน้นความสงบสุขของตัวเองและครอบครัวเป็นหลัก อาจจะถูกมองว่า Ignorant แต่คุณมองว่านี่คือความสุขที่แท้จริง'
    }
};

const questions = [
    {
        q: "เช้านี้ตื่นมา สิ่งแรกที่คุณทำคือ?",
        choices: [
            { text: "เปิดดูข่าวการเมืองย้อนหลัง ฟังนักวิเคราะห์คนโปรดปลุกใจ", score: { NAM_MAK: 3, MADAM: 1 } },
            { text: "เช็คเทรนด์ทวิตเตอร์ (X) หาแท็กการเมืองไว้ปั่นยอด", score: { ORANGE_FAN: 3, NOM_PHONG: 2 } },
            { text: "อ่านบทวิเคราะห์เศรษฐกิจ/การเมืองเชิงโครงสร้าง จากสำนักข่าวดัง", score: { ORANGE_ACADEMIC: 3, NOM_PHONG: 1 } },
            { text: "เช็คหุ้น ดูราคาที่ดิน หรือคุยงานโปรเจกต์รัฐ", score: { BLUE: 3, MADAM: 1 } },
            { text: "ดูรายการ 'เล่าข่าว' เช้านี้ ช่องTop.. หรือช่องหลัก", score: { GREEN: 2, YELLOW_ROYALIST: 2 } },
            { text: "ตักบาตร ฟังธรรม หรืออ่านข่าวพระราชสำนัก/ข่าวดีๆ", score: { YELLOW_CLASSIC: 3, WHITE: 1 } },
            { text: "จิบกาแฟอ่านหนังสือพิมพ์ หรือดูข่าวสภาฯ ย้อนหลังอย่างเงียบๆ", score: { SKY_BLUE: 3 } },
            { text: "รีบอาบน้ำแต่งตัวไปทำงาน รถติดชิบหาย การเมืองไม่ช่วยอะไรกูเลย", score: { WHITE: 3 } }
        ]
    },
    {
        q: "เวลามีคนพูดวิจารณ์ 'ผู้นำจิตวิญญาณ' ของคุณ คุณรู้สึกยังไง?",
        choices: [
            { text: "ยอมไม่ได้! ใครด่ามาด่ากลับไม่โกง พ่อก็คือพ่อ!", score: { ORANGE_FAN: 3, NAM_MAK: 3 } },
            { text: "รับฟัง วิเคราะห์ด้วยเหตุผล แต่ก็เตรียมข้อมูลไปแย้งกลับแบบผู้ดี", score: { ORANGE_ACADEMIC: 3, SKY_BLUE: 2 } },
            { text: "ยิ้มอ่อน จิบชา คิดในใจว่า 'พวกเธอไม่เข้าใจเกมหรอก'", score: { MADAM: 3, BLUE: 1 } },
            { text: "โกรธมาก! พวกนี้ไม่รู้จักที่ต่ำที่สูง ต้องจับให้หมด!", score: { YELLOW_ROYALIST: 3, GREEN: 2 } },
            { text: "เฉยๆ ใครทำผิดก็ว่าไปตามผิด เน้นกติกาบ้านเมือง", score: { YELLOW_CLASSIC: 2, SKY_BLUE: 2 } },
            { text: "ไม่สนใจ ใครจะด่าใครก็เรื่องของเขา ขอแค่หุ้นไม่ตก งานไม่สะดุดพอ", score: { WHITE: 3 } }
        ]
    },
    {
        q: "ถ้าต้องไปม็อบ หรือแสดงพลังทางการเมือง คุณจะเตรียมตัวยังไง?",
        choices: [
            { text: "ตีนตบ มือตบ เสื้อสกรีนลาย พร้อมลุยหน้าเวที", score: { NAM_MAK: 3, YELLOW_CLASSIC: 2 } },
            { text: "เตรียมป้ายข้อความภาษาอังกฤษฟาดๆ หรือมีมตลกๆ ไปถ่าย Content", score: { ORANGE_FAN: 3, NOM_PHONG: 2 } },
            { text: "เตรียมข้อมูล กฎหมาย สิทธิมนุษยชน ไปสังเกตการณ์/ปราศรัย", score: { ORANGE_ACADEMIC: 3 } },
            { text: "ใส่เสื้อเหลือง/ชมพู รอรับเสด็จ แสดงพลังเงียบ", score: { YELLOW_ROYALIST: 3, YELLOW_CLASSIC: 1 } },
            { text: "รอฟังคำสั่งนายครับ! ถ้ามีรถมารับผมก็ไป", score: { GREEN: 3, BLUE: 2 } },
            { text: "ไม่ไปครับ/ค่ะ ไม่ชอบความรุนแรง ขอสู้ในสภาดีกว่า", score: { SKY_BLUE: 3, WHITE: 1 } }
        ]
    },
    {
        q: "เพลงที่คุณคิดว่า 'ใช่' สำหรับบรรยากาศการเมืองตอนนี้?",
        choices: [
            { text: "เพลงแร็พเสียดสีสังคม / เพลงอินดี้เนื้อหาแรงๆ", score: { ORANGE_FAN: 3, NOM_PHONG: 2 } },
            { text: "เพลงเพื่อชีวิตในตำนาน ฟังแล้วน้ำตาไหลเลือดสูบฉีด", score: { NAM_MAK: 3, BLUE: 1 } },
            { text: "เพลงหนักแผ่นดิน / เพลงปลุกใจรักชาติ", score: { GREEN: 3, YELLOW_ROYALIST: 3 } },
            { text: "เพลงพระราชนิพนธ์ ฟังแล้วอบอุ่นหัวใจ", score: { YELLOW_ROYALIST: 3, YELLOW_CLASSIC: 2 } },
            { text: "เพลงเก่ายุค 90 หรือสุนทราภรณ์ คลาสสิกๆ", score: { SKY_BLUE: 3, YELLOW_CLASSIC: 1 } },
            { text: "เพลงรัก เพลงอกหัก เพลง BNK48 อะไรก็ได้ที่ไม่ใช่เพลงการเมือง", score: { WHITE: 3 } }
        ]
    },
    {
        q: "มองเพื่อนบ้านสีส้ม (พรรคก้าวไกล/ประชาชน) ยังไง?",
        choices: [
            { text: "พวกเด็กวานซืน! ก้าวร้าว! ไม่รู้จักที่ต่ำที่สูง!", score: { NAM_MAK: 1, YELLOW_CLASSIC: 2, GREEN: 3 } },
            { text: "อันตราย! ล้มล้าง! เนรคุณแผ่นดิน! (รับไม่ได้อย่างแรง)", score: { YELLOW_ROYALIST: 3, GREEN: 3 } },
            { text: "คือความหวังเดียวของการเปลี่ยนแปลงโครงสร้างประเทศ!", score: { ORANGE_ACADEMIC: 3, ORANGE_FAN: 3 } },
            { text: "ก็ดีนะ มีไฟ แต่อยากให้ลดความสุดโต่งลงหน่อย (พร้อมร่วมงานถ้าจำเป็น)", score: { SKY_BLUE: 3, MADAM: 2 } },
            { text: "เฉยๆ เหมือนพรรคอื่นๆ ถ้ามีผลประโยชน์ร่วมกันก็คุยได้", score: { BLUE: 3 } },
            { text: "ไม่ค่อยชอบที่เสียงดัง แต่ก็เข้าใจว่าเป็นยุคของเขา", score: { WHITE: 2 } }
        ]
    },
    {
        q: "เวลามีเรื่องดราม่าการเมืองเดือดๆ คุณทำอะไร?",
        choices: [
            { text: "ไลฟ์สดด่ากราด หรือโพสต์สเตตัสยาว 8 หน้า A4", score: { DARA: 3, NAM_MAK: 1 } },
            { text: "ขุดข้อมูลเก่ามาแปะ แชร์ Fact Check รัวๆ แย้งด้วยตรรกะ", score: { ORANGE_ACADEMIC: 3, NOM_PHONG: 2 } },
            { text: "ติดแฮชแท็ก ปั่นเทรนด์ พร้อมถล่มทัวร์ลงฝ่ายตรงข้าม", score: { ORANGE_FAN: 3 } },
            { text: "ดูทิศทางลม นิ่งสงบสยบความเคลื่อนไหว ค่อยเลือกข้างที่ชนะ", score: { BLUE: 3, MADAM: 1 } },
            { text: "เรียกร้องให้ใช้กฎหมายเด็ดขาดจัดการพวกป่วนเมือง", score: { GREEN: 3, YELLOW_ROYALIST: 2 } },
            { text: "เลื่อนผ่าน... ดราม่ากินไม่ได้ เอาเวลาไปหาของอร่อยกินดีกว่า", score: { WHITE: 3 } }
        ]
    },
    {
        q: "สุดท้าย... เป้าหมายสูงสุด (Ultimate Goal) ที่คุณอยากเห็นคือ?",
        choices: [
            { text: "คนรากหญ้าต้องอยู่ดีกินดี ปากท้องสำคัญที่สุด เรื่องอื่นไว้ก่อน", score: { NAM_MAK: 3, BLUE: 1 } },
            { text: "รัฐสวัสดิการถ้วนหน้า ยรวรรณกรรมอำนาจคนเท่ากัน", score: { ORANGE_ACADEMIC: 3 } },
            { text: "ชัยชนะเด็ดขาดของฝั่งประชาธิปไตย (ที่กูเชียร์)", score: { ORANGE_FAN: 3, NAM_MAK: 2 } },
            { text: "ชาติ ศาสน์ กษัตริย์ มั่นคงยั่งยืนสถาพร ตลอดไป", score: { YELLOW_ROYALIST: 3, GREEN: 3 } },
            { text: "บ้านเมืองสงบสุข ปราศจากคนโกงกิน", score: { YELLOW_CLASSIC: 3, SKY_BLUE: 2 } },
            { text: "ประชาธิปไตยระบบรัฐสภาที่เข้มแข็ง (แบบค่อยเป็นค่อยไป)", score: { SKY_BLUE: 3 } },
            { text: "มีความสุขกับชีวิตเรียบง่าย รวยๆ เฮงๆ สุขภาพแข็งแรง จบ", score: { WHITE: 3, MADAM: 1 } }
        ]
    }
];

// ============================================
// State Management
// ============================================

let currentQuestionIndex = 0;
let scores = {
    NAM_MAK: 0,
    NOM_PHONG: 0,
    MADAM: 0,
    DARA: 0,
    BLUE: 0,
    SKY_BLUE: 0,
    ORANGE_ACADEMIC: 0,
    ORANGE_FAN: 0,
    YELLOW_CLASSIC: 0,
    YELLOW_ROYALIST: 0,
    GREEN: 0,
    WHITE: 0
};
let currentResult = null;
let quizHistory = [];

// ============================================
// DOM Elements
// ============================================

const contentDiv = document.getElementById('content');
const appElement = document.getElementById('app');

// ============================================
// Dark Mode
// ============================================

function initDarkMode() {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'true') {
        document.body.classList.add('dark-mode');
    }
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// ============================================
// History Management
// ============================================

function loadHistory() {
    const saved = localStorage.getItem('quizHistory');
    if (saved) {
        try {
            quizHistory = JSON.parse(saved);
        } catch (e) {
            quizHistory = [];
        }
    }
}

function saveToHistory(result) {
    const entry = {
        resultId: result.id,
        resultName: result.name,
        resultIcon: result.icon,
        timestamp: new Date().toISOString()
    };
    quizHistory.unshift(entry);
    // Keep only last 10 entries
    if (quizHistory.length > 10) {
        quizHistory = quizHistory.slice(0, 10);
    }
    localStorage.setItem('quizHistory', JSON.stringify(quizHistory));
}

// ============================================
// Confetti Effect
// ============================================

function createConfetti() {
    const colors = ['#dc2626', '#f97316', '#3b82f6', '#a855f7', '#ec4899', '#f59e0b', '#eab308', '#9ca3af', '#15803d', '#38bdf8'];
    const container = document.body;

    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            container.appendChild(confetti);

            setTimeout(() => {
                confetti.remove();
            }, 4000);
        }, i * 20);
    }
}

// ============================================
// Toast Notification
// ============================================

function showToast(message, type = 'success') {
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.background = type === 'success' ? '#10b981' : '#ef4444';
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ============================================
// Share Functions
// ============================================

function getShareText(result) {
    return `ผลทดสอบ: ฉันคือ "${result.name}" ในการเมืองไทย! 🇹🇭\n\nคุณคือสีอะไร? มาทำแบบทดสอบกันเลย! 👇`;
}

function getShareUrl(resultId) {
    const url = new URL(window.location.href);
    url.searchParams.set('result', resultId);
    return url.toString();
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('คัดลอกลิงก์แล้ว!');
    }).catch(() => {
        showToast('คัดลอกไม่สำเร็จ', 'error');
    });
}

function shareTwitter(result) {
    const text = encodeURIComponent(getShareText(result));
    const url = encodeURIComponent(getShareUrl(result.id));
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
}

function shareFacebook(result) {
    const url = encodeURIComponent(getShareUrl(result.id));
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
}

function shareLine(result) {
    const text = encodeURIComponent(getShareText(result) + '\n' + getShareUrl(result.id));
    window.open(`https://social-plugins.line.me/lineit/share?url=${text}`, '_blank');
}

// ============================================
// Render Functions
// ============================================

function renderStartScreen() {
    // Reset state
    currentQuestionIndex = 0;
    scores = { NAM_MAK: 0, NOM_PHONG: 0, MADAM: 0, DARA: 0, BLUE: 0, SKY_BLUE: 0, ORANGE_ACADEMIC: 0, ORANGE_FAN: 0, YELLOW_CLASSIC: 0, YELLOW_ROYALIST: 0, GREEN: 0, WHITE: 0 };
    currentResult = null;

    contentDiv.innerHTML = `
        <div class="text-center w-full fade-in">
            <div class="text-6xl mb-6 animate-bounce">🤔</div>
            <h2 class="text-2xl font-bold text-gray-800 mb-4">ค้นหา "สี" ในใจคุณ</h2>
            <p class="text-gray-600 mb-8 px-4 leading-relaxed">
                การเมืองไทยไม่ได้มีแค่สองด้าน...<br>
                คุณอาจจะใส่เสื้อแดง... แต่แดงเฉดไหน?<br>
                <span class="text-red-800 font-bold">แดงน้ำหมาก?</span>
                <span class="text-green-800 font-bold">เขียวลายพราง?</span> <br>
                <span class="text-orange-600 font-bold">ส้มแบก?</span>
                <span class="text-sky-500 font-bold">ฟ้าประชาธิปัตย์?</span> <br>
                หรือ <span class="text-yellow-600 font-bold">เหลืองรักชาติ</span>?
            </p>
            ${quizHistory.length > 0 ? renderHistorySummary() : ''}
            <button onclick="startGame()" class="w-full bg-red-600 text-white py-4 rounded-xl text-xl font-bold shadow-lg hover:bg-red-700 hover:shadow-xl transition-all transform hover:-translate-y-1 active:translate-y-0">
                เริ่มทำแบบทดสอบ
            </button>
        </div>
    `;
}

function renderHistorySummary() {
    const lastResult = quizHistory[0];
    const date = new Date(lastResult.timestamp);
    const timeAgo = getTimeAgo(date);

    return `
        <div class="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200">
            <p class="text-sm text-gray-600 mb-2">ผลล่าสุดของคุณ (${timeAgo})</p>
            <div class="flex items-center justify-center gap-2">
                <span class="text-3xl">${lastResult.resultIcon}</span>
                <span class="font-bold text-gray-800">${lastResult.resultName}</span>
            </div>
        </div>
    `;
}

function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    const intervals = {
        ปี: 31536000,
        เดือน: 2592000,
        สัปดาห์: 604800,
        วัน: 86400,
        ชั่วโมง: 3600,
        นาที: 60
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);
        if (interval >= 1) {
            return `${interval} ${unit}ที่แล้ว`;
        }
    }
    return 'เมื่อสักครู่';
}

function startGame() {
    renderQuestion();
}

function renderQuestion() {
    const q = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex) / questions.length) * 100;
    const progressPercent = Math.round(progress);

    let html = `
        <div class="w-full h-full flex flex-col fade-in">
            <!-- Progress Bar -->
            <div class="progress-container">
                <div class="progress-bar" style="width: ${progress}%"></div>
            </div>
            <div class="progress-text">${progressPercent}%</div>

            <!-- Question -->
            <h3 class="text-xl font-bold text-gray-800 mb-6 leading-relaxed">
                <span class="text-red-500 text-sm block mb-1">ข้อที่ ${currentQuestionIndex + 1}/${questions.length}</span>
                ${q.q}
            </h3>

            <!-- Choices -->
            <div class="space-y-3 flex-1 overflow-y-auto pb-4">
    `;

    q.choices.forEach((choice, index) => {
        html += `
            <button onclick="selectChoice(${index})" class="choice-btn w-full text-left p-4 rounded-xl border border-gray-200 hover:border-red-400 hover:bg-red-50 bg-white transition-colors group" data-key="${index + 1}">
                <span class="font-medium text-gray-700 group-hover:text-red-700">${choice.text}</span>
            </button>
        `;
    });

    html += `
            <!-- Choices -->
            <div class="space-y-3 flex-1 overflow-y-auto pb-4">
    `;

    q.choices.forEach((choice, index) => {
        html += `
            <button onclick="selectChoice(${index})" class="choice-btn w-full text-left p-4 rounded-xl border border-gray-200 hover:border-red-400 hover:bg-red-50 bg-white transition-colors group" data-key="${index + 1}">
                <span class="font-medium text-gray-700 group-hover:text-red-700">${choice.text}</span>
            </button>
        `;
    });

    html += `
            </div>
        </div>
    `;
    contentDiv.innerHTML = html;
}

function selectChoice(choiceIndex) {
    const q = questions[currentQuestionIndex];
    const selectedChoice = q.choices[choiceIndex];

    // Update scores
    for (const [key, value] of Object.entries(selectedChoice.score)) {
        scores[key] += value;
    }

    // Next question or Result
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        setTimeout(() => {
            renderQuestion();
        }, 200);
    } else {
        showResult();
    }
}

function showResult() {
    // Calculate winner
    let maxScore = -1;
    let winnerKey = '';

    console.log("Final Scores:", scores);

    for (const [key, value] of Object.entries(scores)) {
        if (value > maxScore) {
            maxScore = value;
            winnerKey = key;
        }
    }

    const result = categories[winnerKey];
    currentResult = result;

    // Save to history
    saveToHistory(result);

    // Trigger confetti
    createConfetti();

    contentDiv.innerHTML = `
        <div class="w-full h-full flex flex-col items-center text-center scale-in overflow-y-auto pb-8">
            <div class="text-lg font-bold text-gray-400 mb-2">คุณคือ...</div>

            <div class="text-8xl mb-4 animate-pulse-custom">${result.icon}</div>

            <h2 class="text-3xl font-extrabold ${result.textClass} mb-2 drop-shadow-sm">
                ${result.name}
            </h2>

            <div class="w-full h-1 w-24 ${result.colorClass} rounded-full mx-auto mb-6"></div>

            <div class="result-card">
                <p class="text-gray-700 leading-relaxed font-medium">
                    "${result.desc}"
                </p>
            </div>

            <!-- Share Buttons -->
            <div class="share-buttons">
                <button onclick="copyToClipboard('${getShareUrl(result.id)}')" class="share-btn copy">
                    <span>📋</span> คัดลอกลิงก์
                </button>
                <button onclick="shareTwitter(currentResult)" class="share-btn twitter">
                    <span>𝕏</span> แชร์ทวิตเตอร์
                </button>
                <button onclick="shareFacebook(currentResult)" class="share-btn facebook">
                    <span>f</span> แชร์เฟซบุ๊ก
                </button>
                <button onclick="shareLine(currentResult)" class="share-btn line">
                    <span>LINE</span> แชร์ไลน์
                </button>
            </div>

            ${quizHistory.length > 1 ? renderHistoryPanel() : ''}

            <button onclick="renderStartScreen()" class="w-full bg-gray-800 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-gray-900 transition-all mt-4">
                เล่นใหม่อีกครั้ง
            </button>
        </div>
    `;
}

function renderHistoryPanel() {
    let historyHtml = `
        <div class="history-panel">
            <h4 class="text-sm font-bold text-gray-600 mb-3">ประวัติการทำแบบทดสอบ</h4>
    `;

    quizHistory.slice(1, 4).forEach((entry, index) => {
        const date = new Date(entry.timestamp);
        historyHtml += `
            <div class="history-item">
                <span class="history-icon">${entry.resultIcon}</span>
                <div class="history-info">
                    <div class="history-name">${entry.resultName}</div>
                    <div class="history-date">${getTimeAgo(date)}</div>
                </div>
            </div>
        `;
    });

    historyHtml += `</div>`;
    return historyHtml;
}

// ============================================
// URL Parameter Handling (Shared Results)
// ============================================

function checkSharedResult() {
    const urlParams = new URLSearchParams(window.location.search);
    const resultParam = urlParams.get('result');

    if (resultParam && categories[resultParam]) {
        currentResult = categories[resultParam];
        showResult();
        return true;
    }
    return false;
}

// ============================================
// Keyboard Support
// ============================================

function handleKeyPress(e) {
    // Only handle number keys during question phase
    if (currentQuestionIndex < questions.length) {
        const key = parseInt(e.key);
        if (key >= 1 && key <= 8) {
            const currentQuestion = questions[currentQuestionIndex];
            if (key <= currentQuestion.choices.length) {
                selectChoice(key - 1);
            }
        }
    }
}

// ============================================
// Initialize
// ============================================

function init() {
    // Initialize dark mode
    initDarkMode();

    // Load history
    loadHistory();

    // Check for shared result
    if (!checkSharedResult()) {
        // Show start screen
        renderStartScreen();
    }

    // Add keyboard listener
    document.addEventListener('keydown', handleKeyPress);

    // Add dark mode toggle to header
    const header = document.querySelector('.bg-gradient-to-r');
    if (header) {
        const toggle = document.createElement('button');
        toggle.className = 'dark-mode-toggle';
        toggle.innerHTML = `
            <span class="sun-icon">☀️</span>
            <span class="moon-icon">🌙</span>
        `;
        toggle.onclick = toggleDarkMode;
        header.style.position = 'relative';
        header.appendChild(toggle);
    }
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
