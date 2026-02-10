// ============================================
// Sound Engine (8-bit SFX using AudioContext)
// ============================================

class SoundEngine {
    constructor() {
        this.ctx = null;
        this.enabled = true;
    }

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggle() {
        this.enabled = !this.enabled;
        const icon = document.getElementById('sound-icon');
        if (icon) icon.textContent = this.enabled ? '🔊' : '🔇';
        return this.enabled;
    }

    playTone(freq, type, duration, volume = 0.1) {
        if (!this.enabled || !this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(volume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    playSelect() {
        this.init();
        this.playTone(440, 'square', 0.1);
    }

    playBeep() {
        this.init();
        this.playTone(880, 'square', 0.05);
    }

    playWin() {
        this.init();
        const now = this.ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, i) => {
            setTimeout(() => {
                this.playTone(freq, 'square', 0.2, 0.05);
            }, i * 150);
        });
    }
}

const sound = new SoundEngine();

// ============================================
// Data Definitions
// ============================================

const categories = {
    NAM_MAK: {
        id: 'NAM_MAK',
        name: 'แดงน้ำหมาก',
        icon: '🥊',
        colorClass: 'bg-red-700',
        textClass: 'text-red-500',
        desc: 'คุณคือตำนาน! นักสู้ผู้ผ่านร้อนผ่านหนาว ยึดมั่นในความกตัญญูและพวกพ้อง เชื่อในการลงมือทำจริงมากกว่าคำพูดสวยหรู เคยเจ็บปวดจากประวัติศาสตร์จึงทำให้คุณเข้มแข็งและรักในอุดมการณ์ของตนเองอย่างสุดหัวใจ'
    },
    NOM_PHONG: {
        id: 'NOM_PHONG',
        name: 'แดงนมผง',
        icon: '🍼',
        colorClass: 'bg-pink-500',
        textClass: 'text-pink-400',
        desc: 'คุณคือคนรุ่นใหม่ที่เติบโตมากับประวัติศาสตร์ เน้นวิเคราะห์โครงสร้าง ใช้เหตุผล (แต่ก็พร้อมด่ากราดในทวิตเตอร์/X) เข้าใจโลกยุคใหม่แต่ใจยังรักสีแดง แสวงหาจุดร่วม สงวนจุดต่าง พยายามจะเป็นสะพานเชื่อมรุ่น'
    },
    MADAM: {
        id: 'MADAM',
        name: 'แดงมาดาม',
        icon: '🍷',
        colorClass: 'bg-red-500',
        textClass: 'text-red-400',
        desc: 'สายซัพพอร์ตเกรดพรีเมียม! ชูนิ้วในห้องแอร์ จิบไวน์ดูข่าวการเมือง ชอบความสง่างาม ไม่เน้นลงถนนให้ร้อนหน้า แต่พร้อมโอนไวถ้าใจสั่งมา เน้นความประนีประนอมแบบผู้ดี และเชื่อในการดีลที่ชาญฉลาด'
    },
    DARA: {
        id: 'DARA',
        name: 'แดงดารา/เซเลบ',
        icon: '✨',
        colorClass: 'bg-purple-600',
        textClass: 'text-purple-400',
        desc: 'สปอตไลท์ต้องส่องที่ฉัน! การเมืองคือเวทีแฟชั่น คุณมีวาทะศิลป์เป็นเลิศ โพสต์ทีไรยอดไลก์กระจุย ชอบเป็นผู้นำเทรนด์ อินเนอร์แรง แอกติ้งเลิศ พร้อมเป็นกระบอกเสียง(ที่ดังกว่าคนอื่น) บางทีก็เน้นซีนมากกว่าเนื้อหา'
    },
    ORANGE: {
        id: 'ORANGE',
        name: 'ส้ม (แอบเนียน)',
        icon: '🍊',
        colorClass: 'bg-orange-500',
        textClass: 'text-orange-400',
        desc: 'เอ๊ะ... จริงๆ คุณอาจจะไม่ใช่แดงแท้! คุณต้องการรื้อโครงสร้าง ปฏิรูปทุกสิ่งอย่าง บางทีก็หงุดหงิดกับวิธีคิดแบบเดิมๆ เน้นพุ่งชนเพดาน จนบางทีเพื่อนสีแดงก็มองค้อน คุณเชื่อในหลักการมากกว่าตัวบุคคล'
    },
    BLUE: {
        id: 'BLUE',
        name: 'น้ำเงิน (สายดีล)',
        icon: '🔵',
        colorClass: 'bg-blue-600',
        textClass: 'text-blue-500',
        desc: 'เน้นผลลัพธ์ที่จับต้องได้! คุณคือ "นักปฏิบัติ" ตัวจริง ไม่ชอบความขัดแย้งที่รุนแรง เน้นการพูดคุยหาทางออกร่วมกัน เชื่อว่าการเมืองที่ดีคือการเมืองที่กินได้ สร้างรายได้ และพัฒนาท้องถิ่นให้เจริญรุ่งเรือง มากกว่าการยึดติดกับวาทกรรม'
    },
    SKY_BLUE: {
        id: 'SKY_BLUE',
        name: 'ฟ้า (ประชาธิปัตย์)',
        icon: '🌩️',
        colorClass: 'bg-sky-400',
        textClass: 'text-sky-500',
        desc: 'สุภาพบุรุษนักการเมือง! คุณเชื่อมั่นในระบบรัฐสภาและกฎหมาย (แม้จะแพ้โหวตตลอด) พูดจาหลักการดูดี แต่บางทีก็ช้าไม่ทันใจวัยรุ่น เกลียดการซื้อเสียงและการโกง (แต่ก็เกลียดพวกล้มเจ้ามากกว่า) เน้นความเก๋าเกมและความเป็นสถาบันการเมือง'
    },
    ORANGE_ACADEMIC: {
        id: 'ORANGE_ACADEMIC',
        name: 'ส้มวิชาการ',
        icon: '🍊👓',
        colorClass: 'bg-orange-400',
        textClass: 'text-orange-300',
        desc: 'คุณคือมันสมองของขบวนการ! เน้นข้อมูล สถิติ และโครงสร้างรัฐสวัสดิการแบบกลุ่มนอร์ดิก อธิบายเก่ง พูดจาฉะฉานด้วย Logic ล้วนๆ ไม่เน้นดราม่า แต่เน้นแก้ที่ต้นตอของปัญหาจริงๆ บางทีอาจดูเข้าถึงยากสำหรับชาวบ้าน'
    },
    ORANGE_FAN: {
        id: 'ORANGE_FAN',
        name: 'ส้มแบก/ด้อม',
        icon: '🧡🔥',
        colorClass: 'bg-orange-600',
        textClass: 'text-orange-500',
        desc: 'พลังแห่งความหวัง! คุณพร้อมปกป้องสิ่งที่เชื่อมั่นด้วยความมุ่งมั่น เต็มเปี่ยมไปด้วยพลังในการผลักดันสังคมไปข้างหน้า ต้องการเห็นการเปลี่ยนแปลงที่ดีขึ้น และไม่ลังเลที่จะส่งเสียงเพื่อความถูกต้องในมุมมองของคุณ'
    },
    YELLOW_CLASSIC: {
        id: 'YELLOW_CLASSIC',
        name: 'เหลืองคลาสสิก (คนดี)',
        icon: '🎗️',
        colorClass: 'bg-yellow-400',
        textClass: 'text-yellow-400',
        desc: 'เกลียดการโกงเป็นชีวิตจิตใจ! เชื่อว่า "คนดี" เท่านั้นที่ควรปกครองบ้านเมือง เกลียดนักการเมืองคอร์รัปชัน ยึดมั่นในศีลธรรม จริยธรรม และความสงบเรียบร้อย ชอบเป่านกหวีด... เอ้ย ชอบแสดงพลังต้านโกง'
    },
    YELLOW_ROYALIST: {
        id: 'YELLOW_ROYALIST',
        name: 'เหลืองสถาบัน',
        icon: '👑',
        colorClass: 'bg-yellow-600',
        textClass: 'text-yellow-500',
        desc: 'เสาหลักของสังคม! คุณคือผู้รักษาขนบธรรมเนียมและรากฐานของความเป็นไทย เชื่อว่าความมั่นคงและสถาบันหลักคือสิ่งยึดเหนี่ยวจิตใจที่ทำให้ชาติอยู่รอดปลอดภัยท่ามกลางความเปลี่ยนแปลง'
    },
    GREEN: {
        id: 'GREEN',
        name: 'เขียว (ลายพราง)',
        icon: '🪖',
        colorClass: 'bg-green-700',
        textClass: 'text-green-500',
        desc: 'ความสงบจบที่ลุง! ชอบความเด็ดขาด ระเบียบวินัย และความมั่นคง มองว่านักการเมืองมีแต่สร้างปัญหา ต้องให้ทหารมาดูแลถึงจะเรียบร้อย เชื่อฟังผู้นำ ชาติพ้นภัย ไม่ชอบความวุ่นวายของการชุมนุม'
    },
    WHITE: {
        id: 'WHITE',
        name: 'ขาว (พลังเงียบ)',
        icon: '🏳️',
        colorClass: 'bg-gray-400',
        textClass: 'text-gray-400',
        desc: 'คุณเลือกใช้ชีวิตอย่างสงบสุข เน้นการทำมาหากินและความเจริญของตัวเองและครอบครัวเป็นหลัก ไม่ได้อินกับสีไหนเป็นพิเศษ มองว่าทุกฝ่ายก็มีทั้งคนดีและคนเลว คุณเชื่อว่าความสุขที่แท้จริงอยู่ที่คนใกล้ตัว ไม่ใช่การตัดสินใจทางการเมือง'
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
            { text: "ยอมไม่ได้! ใครด่มาด่ากลับไม่โกง พ่อก็คือพ่อ!", score: { ORANGE_FAN: 3, NAM_MAK: 3 } },
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
let scores = {};
function resetScores() {
    scores = {};
    Object.keys(categories).forEach(k => scores[k] = 0);
}
resetScores();

let currentResult = null;
let quizHistory = [];
let answerHistory = []; // Track answers for back functionality

// ============================================
// Database (Cloudflare D1)
// ============================================

async function saveResultToDatabase(category) {
    console.log("Saving result to Cloudflare:", category.id);
    try {
        // Save to D1 database via Pages Function
        const response = await fetch('/api/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: category.id })
        });

        if (response.ok) {
            console.log("Successfully saved to database");
        } else {
            console.warn("Failed to save to database, using localStorage fallback");
            // Fallback to localStorage if API fails
            const stats = JSON.parse(localStorage.getItem('globalStats') || '{}');
            stats[category.id] = (stats[category.id] || 0) + 1;
            localStorage.setItem('globalStats', JSON.stringify(stats));
        }
    } catch (e) {
        console.error("Failed to save result", e);
        // Fallback to localStorage on error
        const stats = JSON.parse(localStorage.getItem('globalStats') || '{}');
        stats[category.id] = (stats[category.id] || 0) + 1;
        localStorage.setItem('globalStats', JSON.stringify(stats));
    }
}

async function getGlobalStats() {
    try {
        // Get stats from D1 database via Pages Function
        const response = await fetch('/api/stats');
        if (response.ok) {
            const stats = await response.json();
            // Merge with localStorage for any unsaved local results
            const localStats = JSON.parse(localStorage.getItem('globalStats') || '{}');
            return { ...stats, ...localStats };
        } else {
            // Fallback to localStorage if API fails
            return JSON.parse(localStorage.getItem('globalStats') || '{}');
        }
    } catch (e) {
        console.error("Failed to fetch stats", e);
        // Fallback to localStorage on error
        return JSON.parse(localStorage.getItem('globalStats') || '{}');
    }
}

// ============================================
// DOM Elements
// ============================================

const contentDiv = document.getElementById('content');
const appElement = document.getElementById('app');

// ============================================
// Sound Initialization
// ============================================

function setupSound() {
    const btn = document.getElementById('sound-toggle');
    if (btn) {
        btn.onclick = () => {
            sound.toggle();
            sound.playBeep();
        };
    }
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
    if (quizHistory.length > 10) quizHistory = quizHistory.slice(0, 10);
    localStorage.setItem('quizHistory', JSON.stringify(quizHistory));
}

// ============================================
// Render Functions
// ============================================

function renderStartScreen() {
    currentQuestionIndex = 0;
    resetScores();
    currentResult = null;
    answerHistory = []; // Clear answer history

    contentDiv.innerHTML = `
        <div class="text-center w-full fade-in font-['Kanit']">
            <div class="text-6xl mb-6 animate-bounce">⚖️</div>
            <h2 class="text-2xl font-bold text-[#003087] mb-2">เมื่อการเลือกตั้งจบลง...</h2>
            <p class="text-gray-500 mb-8 px-4 text-base leading-relaxed">
                แต่การเมืองยังไม่จบ!<br>
                ในวันที่ขั้วอำนาจเปลี่ยนและอุดมการณ์สั่นคลอน<br>
                คุณยังเป็น <span class="text-red-600 font-bold">แดง</span>, <span class="text-orange-500 font-bold">ส้ม</span>, <span class="text-yellow-500 font-bold">เหลือง</span> หรือ <span class="text-blue-600 font-bold">น้ำเงิน</span> คนเดิมอยู่ไหม?<br>
                มาเช็คจุดยืนกันใหม่ใน <span class="font-bold text-[#003087] text-lg">${questions.length}</span> คำถามวัดใจ!
            </p>
            <button onclick="startGame()" class="w-full bg-[#003087] hover:bg-[#002466] text-white py-4 rounded-lg shadow-lg text-lg font-bold transition-all transform hover:scale-[1.02]">
                เริ่มวิเคราะห์ตัวตน
            </button>
        </div>
    `;
}

function startGame() {
    sound.playSelect();
    renderQuestion();
}

function renderQuestion() {
    const q = questions[currentQuestionIndex];
    const progress = (currentQuestionIndex / questions.length) * 100;

    let html = `
        <div class="w-full h-full flex flex-col fade-in">
            <div class="flex justify-between items-end mb-2">
                <span class="text-sm font-bold text-[#003087]">คำถามที่ ${currentQuestionIndex + 1}</span>
                <span class="text-xs text-gray-500">จาก ${questions.length} ข้อ</span>
            </div>
            <div class="progress-container">
                <div class="progress-bar" style="width: ${progress}%"></div>
            </div>

            ${currentQuestionIndex > 0 ? `
            <button onclick="goBack()" class="self-start text-sm text-gray-500 hover:text-[#003087] transition-colors mb-3 flex items-center gap-1">
                <span>←</span> ย้อนกลับ
            </button>
            ` : ''}

            <h3 class="text-xl font-bold text-gray-800 mb-6 leading-relaxed" style="font-size: 1.25rem;">
                ${q.q}
            </h3>

            <div class="space-y-3 flex-1 overflow-y-auto pb-4 custom-scrollbar">
    `;

    q.choices.forEach((choice, index) => {
        html += `
            <button onclick="selectChoice(${index})" class="choice-btn w-full text-left group">
                <span class="font-medium text-lg group-hover:text-[#003087] transition-colors">${choice.text}</span>
            </button>
        `;
    });

    html += `</div></div>`;
    contentDiv.innerHTML = html;
}

function selectChoice(choiceIndex) {
    sound.playBeep();
    const q = questions[currentQuestionIndex];
    const selectedChoice = q.choices[choiceIndex];

    // Store this answer for potential back navigation
    answerHistory.push({
        questionIndex: currentQuestionIndex,
        choiceIndex: choiceIndex,
        score: {...selectedChoice.score}
    });

    // Add scores
    for (const [key, value] of Object.entries(selectedChoice.score)) {
        scores[key] = (scores[key] || 0) + value;
    }

    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        setTimeout(renderQuestion, 150);
    } else {
        showResult();
    }
}

function goBack() {
    sound.playBeep();

    // Remove the last answer from history
    const lastAnswer = answerHistory.pop();

    if (lastAnswer) {
        // Subtract the scores from the last answer
        for (const [key, value] of Object.entries(lastAnswer.score)) {
            scores[key] = (scores[key] || 0) - value;
            if (scores[key] <= 0) delete scores[key];
        }

        // Go back to the previous question
        currentQuestionIndex = lastAnswer.questionIndex;
        renderQuestion();
    }
}

async function showResult() {
    sound.playWin();
    let maxScore = -1;
    let winnerKey = 'WHITE';

    for (const [key, value] of Object.entries(scores)) {
        if (value > maxScore) {
            maxScore = value;
            winnerKey = key;
        }
    }

    const result = categories[winnerKey];
    currentResult = result;

    saveToHistory(result);
    saveResultToDatabase(result);

    contentDiv.innerHTML = `
        <div class="w-full h-full flex flex-col items-center text-center scale-in overflow-y-auto pb-8 font-['Kanit']">
            <div class="text-sm font-bold text-gray-500 mb-2 uppercase tracking-widest">ผลการวิเคราะห์</div>

            <div class="text-8xl mb-4 filter drop-shadow-md">${result.icon}</div>

            <h2 class="text-3xl font-black ${result.textClass} mb-2 leading-tight">
                ${result.name}
            </h2>

            <div class="result-card mb-6 w-full bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <p class="leading-relaxed text-lg text-gray-700">
                    "${result.desc}"
                </p>
            </div>

            <div class="grid grid-cols-2 gap-3 w-full mb-4">
                <button onclick="goBackFromResult()" class="bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-bold transition-colors">
                    ← ย้อนแก้ไข
                </button>
                <button onclick="showStats()" class="bg-[#003087] hover:bg-[#002466] text-white py-3 rounded-lg font-bold transition-colors">
                    📊 ดูผลโพลรวม
                </button>
            </div>

            <button onclick="renderStartScreen()" class="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-bold transition-colors">
                🔄 เล่นใหม่อีกครั้ง
            </button>
        </div>
    `;
}

function goBackFromResult() {
    sound.playBeep();
    // Go back to the last question
    if (answerHistory.length > 0) {
        const lastAnswer = answerHistory.pop();
        // Subtract the scores from the last answer
        for (const [key, value] of Object.entries(lastAnswer.score)) {
            scores[key] = (scores[key] || 0) - value;
            if (scores[key] <= 0) delete scores[key];
        }
        currentQuestionIndex = lastAnswer.questionIndex;
        renderQuestion();
    }
}

async function showStats() {
    sound.playSelect();
    const stats = await getGlobalStats();
    const total = Object.values(stats).reduce((a, b) => a + b, 0) || 1;

    let html = `
        <div class="w-full h-full flex flex-col fade-in font-['Kanit']">
            <h2 class="text-xl font-bold text-[#003087] mb-6 text-center">📊 ผลโพลผู้เล่นทั่วประเทศ</h2>
            <div class="stats-container flex-1 overflow-y-auto pr-2 custom-scrollbar">
    `;

    const sortedCategories = Object.keys(categories).sort((a, b) => (stats[b] || 0) - (stats[a] || 0));

    sortedCategories.forEach(key => {
        const cat = categories[key];
        const count = stats[key] || 0;
        const percent = Math.round((count / total) * 100);

        // Simple color map for stats bars
        const colorMap = {
            'bg-red-700': '#b91c1c', 'bg-pink-500': '#ec4899', 'bg-red-500': '#ef4444',
            'bg-purple-600': '#9333ea', 'bg-orange-500': '#f97316', 'bg-blue-600': '#2563eb',
            'bg-sky-400': '#38bdf8', 'bg-orange-400': '#fb923c', 'bg-orange-600': '#ea580c',
            'bg-yellow-400': '#facc15', 'bg-yellow-600': '#ca8a04', 'bg-green-700': '#15803d',
            'bg-gray-400': '#9ca3af'
        };

        html += `
            <div class="bar-row">
                <div class="bar-label">
                    <span class="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <span>${cat.icon}</span> ${cat.name}
                    </span>
                    <span class="text-sm font-bold text-[#003087]">${percent}%</span>
                </div>
                <div class="bar-outer">
                    <div class="bar-inner" style="width: ${percent}%; background-color: ${colorMap[cat.colorClass] || '#999'}"></div>
                </div>
            </div>
        `;
    });

    html += `
            </div>
            <button onclick="renderStartScreen()" class="w-full mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-bold transition-colors">
                ⬅ กลับหน้าหลัก
            </button>
        </div>
    `;

    contentDiv.innerHTML = html;
}

// ============================================
// Initialize
// ============================================

function init() {
    loadHistory();
    setupSound();

    // Check for shared result (disabled for now or could be re-implemented)
    const urlParams = new URLSearchParams(window.location.search);
    const resultParam = urlParams.get('result');
    if (resultParam && categories[resultParam]) {
        scores[resultParam] = 100; // Force result
        showResult();
    } else {
        renderStartScreen();
    }
}

document.addEventListener('DOMContentLoaded', init);