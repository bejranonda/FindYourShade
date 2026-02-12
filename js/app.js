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
// Data Definitions & Translations
// ============================================

let currentLang = localStorage.getItem('lang') || 'th';

const translations = {
    th: {
        title: "การเมืองไทย: ฉบับหลังเลือกตั้ง",
        subtitle: "เมื่อฝุ่นจาง... คุณอยู่ตรงไหนในสมการใหม่?",
        poweredBy: "Powered by",
        startTitle: "เมื่อการเลือกตั้งจบลง...",
        startDesc: `แต่การเมืองยังไม่จบ!<br>
                    ในวันที่ขั้วอำนาจเปลี่ยนและอุดมการณ์สั่นคลอน<br>
                    คุณยังเป็น <span class="text-red-600 font-bold">แดง</span>, <span class="text-orange-500 font-bold">ส้ม</span>, <span class="text-yellow-500 font-bold">เหลือง</span> หรือ <span class="text-blue-600 font-bold">น้ำเงิน</span> คนเดิมอยู่ไหม?<br>
                    มาเช็คจุดยืนกันใหม่ใน <span class="font-bold text-[#003087] text-lg">{count}</span> คำถามวัดใจ!`,
        startBtn: "เริ่มวิเคราะห์ตัวตน",
        question: "คำถามที่",
        of: "จาก",
        back: "ย้อนกลับ",
        resultTitle: "ผลการวิเคราะห์",
        edit: "ย้อนแก้ไข",
        stats: "ดูผลลัพธ์จากผู้เล่น",
        playAgain: "เล่นใหม่อีกครั้ง",
        globalStatsTitle: "ผลลัพธ์จากผู้เล่น",
        backHome: "กลับหน้าหลัก",
        share: "แชร์ผลลัพธ์",
        footerRelease: "Release: v3.6.1",
        footerSequel: "ภาคต่อของ Sim Thailand 2569"
    },
    en: {
        title: "Thai Politics: Post-Election Edition",
        subtitle: "When the dust settles... where do you stand?",
        poweredBy: "Powered by",
        startTitle: "The Election is Over...",
        startDesc: `But politics never ends!<br>
                    As power shifts and ideologies shake,<br>
                    Are you still the same <span class="text-red-600 font-bold">Red</span>, <span class="text-orange-500 font-bold">Orange</span>, <span class="text-yellow-500 font-bold">Yellow</span>, or <span class="text-blue-600 font-bold">Blue</span>?<br>
                    Find your true shade in <span class="font-bold text-[#003087] text-lg">{count}</span> questions!`,
        startBtn: "Start Quiz",
        question: "Question",
        of: "of",
        back: "Back",
        resultTitle: "Analysis Result",
        edit: "Edit Answers",
        stats: "Player Response Statistics",
        playAgain: "Play Again",
        globalStatsTitle: "Player Response Statistics",
        backHome: "Back to Home",
        share: "Share Result",
        footerRelease: "Release: v3.6.1",
        footerSequel: "Sequel to Sim Thailand 2569"
    }
};

const categories = {
    NAM_MAK: {
        id: 'NAM_MAK',
        name: { th: 'แดงน้ำหมาก', en: 'Red (Traditionalist)' },
        icon: '🥊',
        confettiEmoji: ['🥊', '❤️'],
        colorClass: 'bg-red-700',
        textClass: 'text-red-500',
        desc: {
            th: 'คุณคือตำนาน! นักสู้ผู้ผ่านร้อนผ่านหนาว ยึดมั่นในความกตัญญูและพวกพ้อง เชื่อในการลงมือทำจริงมากกว่าคำพูดสวยหรู เคยเจ็บปวดจากประวัติศาสตร์จึงทำให้คุณเข้มแข็งและรักในอุดมการณ์ของตนเองอย่างสุดหัวใจ',
            en: 'You are a legend! A fighter who has seen it all. You value gratitude and loyalty to your group. You believe in action over pretty words. Past struggles have made you strong and deeply committed to your ideology.'
        }
    },
    NOM_PHONG: {
        id: 'NOM_PHONG',
        name: { th: 'แดงนมผง', en: 'Red (New Gen)' },
        icon: '🍼',
        confettiEmoji: ['🍼', '❤️'],
        colorClass: 'bg-pink-500',
        textClass: 'text-pink-400',
        desc: {
            th: 'คุณคือคนรุ่นใหม่ที่เติบโตมากับประวัติศาสตร์ เน้นวิเคราะห์โครงสร้าง ใช้เหตุผล (แต่ก็พร้อมด่ากราดในทวิตเตอร์/X) เข้าใจโลกยุคใหม่แต่ใจยังรักสีแดง แสวงหาจุดร่วม สงวนจุดต่าง พยายามจะเป็นสะพานเชื่อมรุ่น',
            en: 'You are the new generation raised on history. You analyze structures and use reason (but are ready to rant on X). You understand the modern world but your heart is Red. You seek common ground and try to bridge the generational gap.'
        }
    },
    MADAM: {
        id: 'MADAM',
        name: { th: 'แดงมาดาม', en: 'Red (Elite/Madam)' },
        icon: '🍷',
        confettiEmoji: ['🍷', '👠'],
        colorClass: 'bg-red-500',
        textClass: 'text-red-400',
        desc: {
            th: 'สายซัพพอร์ตเกรดพรีเมียม! ชูนิ้วในห้องแอร์ จิบไวน์ดูข่าวการเมือง ชอบความสง่างาม ไม่เน้นลงถนนให้ร้อนหน้า แต่พร้อมโอนไวถ้าใจสั่งมา เน้นความประนีประนอมแบบผู้ดี และเชื่อในการดีลที่ชาญฉลาด',
            en: 'Premium support! You flash signs from air-conditioned rooms, sipping wine while watching the news. You prefer elegance over street protests, but are ready to transfer funds instantly. You believe in polite compromise and smart deals.'
        }
    },
    DARA: {
        id: 'DARA',
        name: { th: 'แดงดารา/เซเลบ', en: 'Red (Celeb)' },
        icon: '✨',
        confettiEmoji: ['✨', '⭐'],
        colorClass: 'bg-purple-600',
        textClass: 'text-purple-400',
        desc: {
            th: 'สปอตไลท์ต้องส่องที่ฉัน! การเมืองคือเวทีแฟชั่น คุณมีวาทะศิลป์เป็นเลิศ โพสต์ทีไรยอดไลก์กระจุย ชอบเป็นผู้นำเทรนด์ อินเนอร์แรง แอกติ้งเลิศ พร้อมเป็นกระบอกเสียง(ที่ดังกว่าคนอื่น) บางทีก็เน้นซีนมากกว่าเนื้อหา',
            en: 'Spotlight on me! Politics is a fashion stage. You are eloquent and your posts go viral. You are a trendsetter with strong inner energy, ready to be a loud voice (sometimes louder than others), occasionally prioritizing the scene over substance.'
        }
    },
    ORANGE: {
        id: 'ORANGE',
        name: { th: 'ส้ม (แอบเนียน)', en: 'Orange (Closeted)' },
        icon: '🍊',
        confettiEmoji: ['🍊', '💡'],
        colorClass: 'bg-orange-500',
        textClass: 'text-orange-400',
        desc: {
            th: 'เอ๊ะ... จริงๆ คุณอาจจะไม่ใช่แดงแท้! คุณต้องการรื้อโครงสร้าง ปฏิรูปทุกสิ่งอย่าง บางทีก็หงุดหงิดกับวิธีคิดแบบเดิมๆ เน้นพุ่งชนเพดาน จนบางทีเพื่อนสีแดงก็มองค้อน คุณเชื่อในหลักการมากกว่าตัวบุคคล',
            en: 'Wait... are you really Red? You want to dismantle structures and reform everything. You get frustrated with old ways and want to break the ceiling, sometimes annoying your Red friends. You value principles over people.'
        }
    },
    BLUE: {
        id: 'BLUE',
        name: { th: 'น้ำเงิน (สายดีล)', en: 'Blue (The Deal Maker)' },
        icon: '🔵',
        confettiEmoji: ['🌿', '💰'],
        colorClass: 'bg-blue-600',
        textClass: 'text-blue-500',
        desc: {
            th: 'เน้นผลลัพธ์ที่จับต้องได้! คุณคือ "นักปฏิบัติ" ตัวจริง ไม่ชอบความขัดแย้งที่รุนแรง เน้นการพูดคุยหาทางออกร่วมกัน เชื่อว่าการเมืองที่ดีคือการเมืองที่กินได้ สร้างรายได้ และพัฒนาท้องถิ่นให้เจริญรุ่งเรือง มากกว่าการยึดติดกับวาทกรรม',
            en: 'Results oriented! You are a true "Doer". You dislike violent conflict and prefer negotiation. You believe good politics puts food on the table, creates income, and develops the locality, rather than sticking to rhetoric.'
        }
    },
    SKY_BLUE: {
        id: 'SKY_BLUE',
        name: { th: 'ฟ้า (ประชาธิปัตย์)', en: 'Sky Blue (Democrat)' },
        icon: '🌩️',
        confettiEmoji: ['💧', '🕊️'],
        colorClass: 'bg-sky-400',
        textClass: 'text-sky-500',
        desc: {
            th: 'สุภาพบุรุษนักการเมือง! คุณเชื่อมั่นในระบบรัฐสภาและกฎหมาย (แม้จะแพ้โหวตตลอด) พูดจาหลักการดูดี แต่บางทีก็ช้าไม่ทันใจวัยรุ่น เกลียดการซื้อเสียงและการโกง (แต่ก็เกลียดพวกล้มเจ้ามากกว่า) เน้นความเก๋าเกมและความเป็นสถาบันการเมือง',
            en: 'The Gentleman Politician! You believe in the parliamentary system and law (even if you always lose votes). You speak well on principles but can be slow for the youth. You hate vote-buying and corruption (but hate anti-monarchists more). You value experience and political institutions.'
        }
    },
    ORANGE_ACADEMIC: {
        id: 'ORANGE_ACADEMIC',
        name: { th: 'ส้มวิชาการ', en: 'Orange (Academic)' },
        icon: '🍊👓',
        confettiEmoji: ['📚', '💡'],
        colorClass: 'bg-orange-400',
        textClass: 'text-orange-300',
        desc: {
            th: 'คุณคือมันสมองของขบวนการ! เน้นข้อมูล สถิติ และโครงสร้างรัฐสวัสดิการแบบกลุ่มนอร์ดิก อธิบายเก่ง พูดจาฉะฉานด้วย Logic ล้วนๆ ไม่เน้นดราม่า แต่เน้นแก้ที่ต้นตอของปัญหาจริงๆ บางทีอาจดูเข้าถึงยากสำหรับชาวบ้าน',
            en: 'The brains of the movement! You focus on data, statistics, and Nordic-style welfare structures. You explain things well with pure logic, avoiding drama to solve root problems. Sometimes you might seem inaccessible to the common people.'
        }
    },
    ORANGE_FAN: {
        id: 'ORANGE_FAN',
        name: { th: 'ส้มแบก/ด้อม', en: 'Orange (Supporter)' },
        icon: '🧡🔥',
        confettiEmoji: ['🔥', '🧡'],
        colorClass: 'bg-orange-600',
        textClass: 'text-orange-500',
        desc: {
            th: 'พลังแห่งความหวัง! คุณพร้อมปกป้องสิ่งที่เชื่อมั่นด้วยความมุ่งมั่น เต็มเปี่ยมไปด้วยพลังในการผลักดันสังคมไปข้างหน้า ต้องการเห็นการเปลี่ยนแปลงที่ดีขึ้น และไม่ลังเลที่จะส่งเสียงเพื่อความถูกต้องในมุมมองของคุณ',
            en: 'The Power of Hope! You are ready to defend what you believe in with determination. Full of energy to push society forward, you want to see better changes and hesitate not to voice out for what you see as right.'
        }
    },
    YELLOW_CLASSIC: {
        id: 'YELLOW_CLASSIC',
        name: { th: 'เหลืองคลาสสิก (คนดี)', en: 'Yellow (Classic)' },
        icon: '🎗️',
        confettiEmoji: ['🎗️', '💛'],
        colorClass: 'bg-yellow-400',
        textClass: 'text-yellow-400',
        desc: {
            th: 'เกลียดการโกงเป็นชีวิตจิตใจ! เชื่อว่า "คนดี" เท่านั้นที่ควรปกครองบ้านเมือง เกลียดนักการเมืองคอร์รัปชัน ยึดมั่นในศีลธรรม จริยธรรม และความสงบเรียบร้อย ชอบเป่านกหวีด... เอ้ย ชอบแสดงพลังต้านโกง',
            en: 'Hate corruption with a passion! You believe only "Good People" should rule. You despise corrupt politicians and hold fast to morals, ethics, and order. You like blowing whistles... er, showing anti-corruption power.'
        }
    },
    YELLOW_ROYALIST: {
        id: 'YELLOW_ROYALIST',
        name: { th: 'เหลืองสถาบัน', en: 'Yellow (Royalist)' },
        icon: '👑',
        confettiEmoji: ['👑', '🏛️'],
        colorClass: 'bg-yellow-600',
        textClass: 'text-yellow-500',
        desc: {
            th: 'เสาหลักของสังคม! คุณคือผู้รักษาขนบธรรมเนียมและรากฐานของความเป็นไทย เชื่อว่าความมั่นคงและสถาบันหลักคือสิ่งยึดเหนี่ยวจิตใจที่ทำให้ชาติอยู่รอดปลอดภัยท่ามกลางความเปลี่ยนแปลง',
            en: 'Pillar of Society! You are the guardian of Thai traditions and foundations. You believe that stability and the main institutions are the spiritual anchors that keep the nation safe amidst change.'
        }
    },
    GREEN: {
        id: 'GREEN',
        name: { th: 'เขียว (ลายพราง)', en: 'Green (Military)' },
        icon: '🪖',
        confettiEmoji: ['🪖', '🛡️'],
        colorClass: 'bg-green-700',
        textClass: 'text-green-500',
        desc: {
            th: 'ความสงบจบที่ลุง! ชอบความเด็ดขาด ระเบียบวินัย และความมั่นคง มองว่านักการเมืองมีแต่สร้างปัญหา ต้องให้ทหารมาดูแลถึงจะเรียบร้อย เชื่อฟังผู้นำ ชาติพ้นภัย ไม่ชอบความวุ่นวายของการชุมนุม',
            en: 'Peace ends with Uncle! You like decisiveness, discipline, and stability. You see politicians as trouble-makers; soldiers are needed to keep order. Obey the leader, the nation is safe. You dislike the chaos of protests.'
        }
    },
    WHITE: {
        id: 'WHITE',
        name: { th: 'ขาว (พลังเงียบ)', en: 'White (Silent Power)' },
        icon: '🏳️',
        confettiEmoji: ['☕', '🏳️'],
        colorClass: 'bg-gray-400',
        textClass: 'text-gray-400',
        desc: {
            th: 'คุณเลือกใช้ชีวิตอย่างสงบสุข เน้นการทำมาหากินและความเจริญของตัวเองและครอบครัวเป็นหลัก ไม่ได้อินกับสีไหนเป็นพิเศษ มองว่าทุกฝ่ายก็มีทั้งคนดีและคนเลว คุณเชื่อว่าความสุขที่แท้จริงอยู่ที่คนใกล้ตัว ไม่ใช่การตัดสินใจทางการเมือง',
            en: 'You choose a peaceful life, focusing on earning a living and the prosperity of yourself and your family. Not particularly into any color, seeing good and bad in all sides. You believe true happiness lies with those close to you, not political decisions.'
        }
    }
};

const questions = [
    {
        q: {
            th: "เช้านี้ตื่นมา สิ่งแรกที่คุณทำคือ?",
            en: "What's the first thing you do when you wake up?"
        },
        choices: [
            { text: { th: "เปิดดูข่าวการเมืองย้อนหลัง ฟังนักวิเคราะห์คนโปรดปลุกใจ", en: "Watch past political news, listen to favorite analysts." }, score: { NAM_MAK: 3, MADAM: 1 } },
            { text: { th: "เช็คเทรนด์ทวิตเตอร์ (X) หาแท็กการเมืองไว้ปั่นยอด", en: "Check Twitter (X) trends, find political tags to boost." }, score: { ORANGE_FAN: 3, NOM_PHONG: 2 } },
            { text: { th: "อ่านบทวิเคราะห์เศรษฐกิจ/การเมืองเชิงโครงสร้าง จากสำนักข่าวดัง", en: "Read structural economic/political analysis from major outlets." }, score: { ORANGE_ACADEMIC: 3, NOM_PHONG: 1 } },
            { text: { th: "เช็คหุ้น ดูราคาที่ดิน หรือคุยงานโปรเจกต์รัฐ", en: "Check stocks, land prices, or discuss government projects." }, score: { BLUE: 3, MADAM: 1 } },
            { text: { th: "ดูรายการ 'เล่าข่าว' เช้านี้ ช่องTop.. หรือช่องหลัก", en: "Watch morning news programs on main channels." }, score: { GREEN: 2, YELLOW_ROYALIST: 2 } },
            { text: { th: "ตักบาตร ฟังธรรม หรืออ่านข่าวพระราชสำนัก/ข่าวดีๆ", en: "Offer alms, listen to sermons, or read royal news/good news." }, score: { YELLOW_CLASSIC: 3, WHITE: 1 } },
            { text: { th: "จิบกาแฟอ่านหนังสือพิมพ์ หรือดูข่าวสภาฯ ย้อนหลังอย่างเงียบๆ", en: "Sip coffee reading the paper or quietly watching parliament clips." }, score: { SKY_BLUE: 3 } },
            { text: { th: "รีบอาบน้ำแต่งตัวไปทำงาน รถติดชิบหาย การเมืองไม่ช่วยอะไรกูเลย", en: "Rush to work, traffic is hell. Politics helps me nothing." }, score: { WHITE: 3 } },
            { text: { th: "เปิดดูข่าวหลายช่อง เทียบกันไปมา อยากรู้ว่าแต่ละฝ่ายมองยังไง", en: "Watch multiple channels, compare sides, want to see different perspectives." }, score: { NOM_PHONG: 2, ORANGE: 2 } },
            { text: { th: "โพสต์ IG Story คำคมปลุกใจ พร้อมแท็กเพื่อนดารา", en: "Post motivational IG Story with celebrity friend tags." }, score: { DARA: 3, MADAM: 1 } }
        ]
    },
    {
        q: {
            th: "เวลามีคนพูดวิจารณ์ 'ผู้นำจิตวิญญาณ' ของคุณ คุณรู้สึกยังไง?",
            en: "How do you feel when someone criticizes your 'Spiritual Leader'?"
        },
        choices: [
            { text: { th: "ยอมไม่ได้! ใครด่มาด่ากลับไม่โกง พ่อก็คือพ่อ!", en: "Unacceptable! I'll curse back. Father is Father!" }, score: { ORANGE_FAN: 3, NAM_MAK: 3 } },
            { text: { th: "รับฟัง วิเคราะห์ด้วยเหตุผล แต่ก็เตรียมข้อมูลไปแย้งกลับแบบผู้ดี", en: "Listen, analyze with reason, but prepare data to politely counter." }, score: { ORANGE_ACADEMIC: 3, SKY_BLUE: 2 } },
            { text: { th: "ยิ้มอ่อน จิบชา คิดในใจว่า 'พวกเธอไม่เข้าใจเกมหรอก'", en: "Smirk, sip tea, thinking 'You don't understand the game'." }, score: { MADAM: 3, BLUE: 1 } },
            { text: { th: "โกรธมาก! พวกนี้ไม่รู้จักที่ต่ำที่สูง ต้องจับให้หมด!", en: "Furious! They don't know their place. Arrest them all!" }, score: { YELLOW_ROYALIST: 3, GREEN: 2 } },
            { text: { th: "เฉยๆ ใครทำผิดก็ว่าไปตามผิด เน้นกติกาบ้านเมือง", en: "Indifferent. Wrong is wrong, focus on the rules." }, score: { YELLOW_CLASSIC: 2, SKY_BLUE: 2 } },
            { text: { th: "ไม่สนใจ ใครจะด่าใครก็เรื่องของเขา ขอแค่หุ้นไม่ตก งานไม่สะดุดพอ", en: "Don't care. As long as stocks don't drop and work isn't interrupted." }, score: { WHITE: 3 } },
            { text: { th: "ฟังทุกฝ่าย พยายามเข้าใจ แม้ไม่เห็นด้วยก็ไม่ทะเลาะ เชื่อว่าเปลี่ยนได้ด้วยเหตุผล", en: "Listen to all sides, try to understand, don't argue. Change comes with reason." }, score: { NOM_PHONG: 3, ORANGE: 1 } },
            { text: { th: "โพสต์คลิปตอบโต้อย่างเท่ๆ พร้อมเรียกยอดวิว", en: "Post a cool rebuttal clip to boost views." }, score: { DARA: 3, ORANGE_FAN: 1 } }
        ]
    },
    {
        q: {
            th: "ถ้าต้องไปม็อบ หรือแสดงพลังทางการเมือง คุณจะเตรียมตัวยังไง?",
            en: "If you go to a protest or show political force, how do you prepare?"
        },
        choices: [
            { text: { th: "ตีนตบ มือตบ เสื้อสกรีนลาย พร้อมลุยหน้าเวที", en: "Clappers, screened shirt, ready for the front stage." }, score: { NAM_MAK: 3, YELLOW_CLASSIC: 2 } },
            { text: { th: "เตรียมป้ายข้อความภาษาอังกฤษฟาดๆ หรือมีมตลกๆ ไปถ่าย Content", en: "Prepare English signs or funny memes for content." }, score: { ORANGE_FAN: 3, NOM_PHONG: 2 } },
            { text: { th: "เตรียมข้อมูล กฎหมาย สิทธิมนุษยชน ไปสังเกตการณ์/ปราศรัย", en: "Prepare legal/human rights info to observe/speak." }, score: { ORANGE_ACADEMIC: 3 } },
            { text: { th: "ใส่เสื้อเหลือง/ชมพู รอรับเสด็จ แสดงพลังเงียบ", en: "Wear Yellow/Pink, wait for reception, show silent power." }, score: { YELLOW_ROYALIST: 3, YELLOW_CLASSIC: 1 } },
            { text: { th: "รอฟังคำสั่งนายครับ! ถ้ามีรถมารับผมก็ไป", en: "Waiting for orders, Sir! If there's a ride, I go." }, score: { GREEN: 3, BLUE: 2 } },
            { text: { th: "ไม่ไปครับ/ค่ะ ไม่ชอบความรุนแรง ขอสู้ในสภาดีกว่า", en: "Not going. I dislike violence, prefer fighting in parliament." }, score: { SKY_BLUE: 3, WHITE: 1 } },
            { text: { th: "ไปดูบรรยากาศ ไม่ได้เชียร์ฝ่ายไหนจริงจัง แค่อยากรู้ว่าเกิดอะไรขึ้น", en: "Go to observe, not really cheering anyone, just curious." }, score: { WHITE: 2, NOM_PHONG: 1, ORANGE: 1 } },
            { text: { th: "แต่งตัวสวยๆ ไปถ่ายรูปเช็คอิน โพสต์ลงโซเชียลให้เพื่อนเห็น", en: "Dress up, take photos, check in on social media for friends to see." }, score: { DARA: 3, MADAM: 1 } }
        ]
    },
    {
        q: {
            th: "เพลงที่คุณคิดว่า 'ใช่' สำหรับบรรยากาศการเมืองตอนนี้?",
            en: "Which song fits the current political atmosphere?"
        },
        choices: [
            { text: { th: "เพลงแร็พเสียดสีสังคม / เพลงอินดี้เนื้อหาแรงๆ", en: "Social satire Rap / Indie songs with strong lyrics." }, score: { ORANGE_FAN: 3, NOM_PHONG: 2 } },
            { text: { th: "เพลงเพื่อชีวิตในตำนาน ฟังแล้วน้ำตาไหลเลือดสูบฉีด", en: "Legendary 'Songs for Life', tear-jerking and pumping blood." }, score: { NAM_MAK: 3, BLUE: 1 } },
            { text: { th: "เพลงหนักแผ่นดิน / เพลงปลุกใจรักชาติ", en: "Nak Paen Din / Patriotic songs." }, score: { GREEN: 3, YELLOW_ROYALIST: 3 } },
            { text: { th: "เพลงพระราชนิพนธ์ ฟังแล้วอบอุ่นหัวใจ", en: "Royal compositions, warming the heart." }, score: { YELLOW_ROYALIST: 3, YELLOW_CLASSIC: 2 } },
            { text: { th: "เพลงเก่ายุค 90 หรือสุนทราภรณ์ คลาสสิกๆ", en: "90s hits or Suntaraporn classics." }, score: { SKY_BLUE: 3, YELLOW_CLASSIC: 1 } },
            { text: { th: "เพลงรัก เพลงอกหัก เพลง BNK48 อะไรก็ได้ที่ไม่ใช่เพลงการเมือง", en: "Love songs, BNK48, anything but politics." }, score: { WHITE: 3 } },
            { text: { th: "ฟังทุกแนว ไม่จำกัดเพลงกับสี ชอบเพลงที่มีเนื้อหาดีไม่ว่าฝ่ายไหน", en: "Listen to everything, music isn't political. Good lyrics from any side." }, score: { NOM_PHONG: 2, ORANGE: 2, WHITE: 1 } },
            { text: { th: "เพลงฮิตติด TikTok / เพลงป็อปไวรัล พร้อมทำคลิปเต้นล้อการเมือง", en: "TikTok hits / Viral pop, ready to make political dance clips." }, score: { DARA: 3, ORANGE_FAN: 1 } }
        ]
    },
    {
        q: {
            th: "มองเพื่อนบ้านสีส้ม (พรรคก้าวไกล/ประชาชน) ยังไง?",
            en: "How do you view the Orange neighbors (Move Forward/People's Party)?"
        },
        choices: [
            { text: { th: "พวกเด็กวานซืน! ก้าวร้าว! ไม่รู้จักที่ต่ำที่สูง!", en: "Brats! Aggressive! Don't know their place!" }, score: { NAM_MAK: 1, YELLOW_CLASSIC: 2, GREEN: 3 } },
            { text: { th: "อันตราย! ล้มล้าง! เนรคุณแผ่นดิน! (รับไม่ได้อย่างแรง)", en: "Dangerous! Overthrowers! Ungrateful! (Totally unacceptable)" }, score: { YELLOW_ROYALIST: 3, GREEN: 3 } },
            { text: { th: "คือความหวังเดียวของการเปลี่ยนแปลงโครงสร้างประเทศ!", en: "The only hope for structural change in the country!" }, score: { ORANGE_ACADEMIC: 3, ORANGE_FAN: 3 } },
            { text: { th: "ก็ดีนะ มีไฟ แต่อยากให้ลดความสุดโต่งลงหน่อย (พร้อมร่วมงานถ้าจำเป็น)", en: "Good energy, but should tone down the extremism (ready to work if needed)." }, score: { SKY_BLUE: 3, MADAM: 2 } },
            { text: { th: "เฉยๆ เหมือนพรรคอื่นๆ ถ้ามีผลประโยชน์ร่วมกันก็คุยได้", en: "Indifferent like others. If interests align, we can talk." }, score: { BLUE: 3 } },
            { text: { th: "ไม่ค่อยชอบที่เสียงดัง แต่ก็เข้าใจว่าเป็นยุคของเขา", en: "Don't like the noise, but understand it's their era." }, score: { WHITE: 2 } },
            { text: { th: "เห็นด้วยกับหลายนโยบาย แต่ไม่ชอบสไตล์การสื่อสาร อยากให้นุ่มกว่านี้", en: "Agree with many policies, but dislike the communication style. Wish it were softer." }, score: { NOM_PHONG: 2, ORANGE: 3 } },
            { text: { th: "ก็ดี แต่จริงๆ ฝั่งแดงก็ทำได้เหมือนกัน แค่ไม่ได้โปรโมตดี", en: "They're fine, but the Red side can do the same, just not well promoted." }, score: { NAM_MAK: 2, MADAM: 2 } }
        ]
    },
    {
        q: {
            th: "เวลามีเรื่องดราม่าการเมืองเดือดๆ คุณทำอะไร?",
            en: "When there's a hot political drama, what do you do?"
        },
        choices: [
            { text: { th: "ไลฟ์สดด่ากราด หรือโพสต์สเตตัสยาว 8 หน้า A4", en: "Live stream rant or post 8 pages of A4 status." }, score: { DARA: 3, NAM_MAK: 1 } },
            { text: { th: "ขุดข้อมูลเก่ามาแปะ แชร์ Fact Check รัวๆ แย้งด้วยตรรกะ", en: "Dig up old info, share Fact Checks, argue with logic." }, score: { ORANGE_ACADEMIC: 3, NOM_PHONG: 2 } },
            { text: { th: "ติดแฮชแท็ก ปั่นเทรนด์ พร้อมถล่มทัวร์ลงฝ่ายตรงข้าม", en: "Hashtag, boost trend, ready to raid the opponent." }, score: { ORANGE_FAN: 3 } },
            { text: { th: "ดูทิศทางลม นิ่งสงบสยบความเคลื่อนไหว ค่อยเลือกข้างที่ชนะ", en: "Check the wind direction, stay calm, then pick the winner." }, score: { BLUE: 3, MADAM: 1 } },
            { text: { th: "เรียกร้องให้ใช้กฎหมายเด็ดขาดจัดการพวกป่วนเมือง", en: "Demand strict laws to deal with troublemakers." }, score: { GREEN: 3, YELLOW_ROYALIST: 2 } },
            { text: { th: "เลื่อนผ่าน... ดราม่ากินไม่ได้ เอาเวลาไปหาของอร่อยกินดีกว่า", en: "Scroll past... Drama isn't edible. Find good food instead." }, score: { WHITE: 3 } },
            { text: { th: "อ่านทั้งสองฝ่าย พยายามเข้าใจว่าทำไมแต่ละคนถึงคิดแบบนั้น", en: "Read both sides, try to understand why each person thinks that way." }, score: { NOM_PHONG: 3, SKY_BLUE: 1 } },
            { text: { th: "โพสต์สรุปประเด็นอย่างเท่ๆ เน้นได้ยอด engagement แต่ก็ไม่ได้เลือกข้าง", en: "Post a cool summary for engagement, without taking sides." }, score: { DARA: 2, ORANGE: 2 } }
        ]
    },
    {
        q: {
            th: "สุดท้าย... เป้าหมายสูงสุด (Ultimate Goal) ที่คุณอยากเห็นคือ?",
            en: "Finally... What is the Ultimate Goal you want to see?"
        },
        choices: [
            { text: { th: "คนรากหญ้าต้องอยู่ดีกินดี ปากท้องสำคัญที่สุด เรื่องอื่นไว้ก่อน", en: "Grassroots well-being is key. Livelihood first, others later." }, score: { NAM_MAK: 3, BLUE: 1 } },
            { text: { th: "รัฐสวัสดิการถ้วนหน้า กระจายอำนาจ คนเท่ากัน", en: "Universal Welfare State. Decentralization. Equality." }, score: { ORANGE_ACADEMIC: 3 } },
            { text: { th: "ชัยชนะเด็ดขาดของฝั่งประชาธิปไตย (ที่กูเชียร์)", en: "Decisive victory for the Democratic side (that I cheer for)." }, score: { ORANGE_FAN: 3, NAM_MAK: 2 } },
            { text: { th: "ชาติ ศาสน์ กษัตริย์ มั่นคงยั่งยืนสถาพร ตลอดไป", en: "Nation, Religion, King. Stable and enduring forever." }, score: { YELLOW_ROYALIST: 3, GREEN: 3 } },
            { text: { th: "บ้านเมืองสงบสุข ปราศจากคนโกงกิน", en: "Peaceful country, free from corruption." }, score: { YELLOW_CLASSIC: 3, SKY_BLUE: 2 } },
            { text: { th: "ประชาธิปไตยระบบรัฐสภาที่เข้มแข็ง (แบบค่อยเป็นค่อยไป)", en: "Strong Parliamentary Democracy (Gradual approach)." }, score: { SKY_BLUE: 3 } },
            { text: { th: "มีความสุขกับชีวิตเรียบง่าย รวยๆ เฮงๆ สุขภาพแข็งแรง จบ", en: "Happy simple life, rich, lucky, healthy. Period." }, score: { WHITE: 3, MADAM: 1 } },
            { text: { th: "อยากเห็นทุกฝ่ายคุยกันได้ ไม่แบ่งสี ไม่เกลียดกัน ประเทศไปข้างหน้าด้วยกัน", en: "Wish all sides could talk, no divides, no hate, the country moves forward together." }, score: { NOM_PHONG: 2, ORANGE: 2, WHITE: 1 } },
            { text: { th: "เน้นพัฒนาเศรษฐกิจ สร้างโอกาส ใครปกครองก็ได้ ขอให้เงินหมุน", en: "Focus on economy, create opportunities. Anyone can govern, just keep money flowing." }, score: { BLUE: 3, MADAM: 2 } }
        ]
    }
];

// ============================================
// Utility Functions
// ============================================

/**
 * Fisher-Yates shuffle algorithm for randomizing array order
 * @param {Array} array - Array to shuffle
 * @returns {Array} - New shuffled array (does not modify original)
 */
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// ============================================
// State Management
// ============================================

let currentQuestionIndex = 0;
let shuffledChoices = []; // Store shuffled choice indices for current question
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
// Sound Initialization & Language
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

function setLanguage(lang) {
    if (lang !== 'th' && lang !== 'en') return;
    currentLang = lang;
    localStorage.setItem('lang', lang);
    updateStaticText();
    // Re-render current view
    if (currentResult) {
        showResult();
    } else if (currentQuestionIndex > 0) {
        renderQuestion();
    } else {
        renderStartScreen();
    }
}

function updateStaticText() {
    const t = translations[currentLang];

    // Header
    const titleEl = document.querySelector('h1');
    if (titleEl) titleEl.textContent = t.title;

    const subtitleEl = document.querySelector('h1 + p');
    if (subtitleEl) subtitleEl.textContent = t.subtitle;

    // Footer
    const releaseLink = document.querySelector('a[href*="releases"]');
    if (releaseLink) releaseLink.textContent = t.footerRelease;

    const sequelLink = document.querySelector('a[href*="sim2569"]');
    if (sequelLink) sequelLink.innerHTML = `🎮 ${t.footerSequel}`;

    const statsBtn = document.querySelector('button[onclick="showStats()"]');
    if (statsBtn) statsBtn.textContent = t.globalStatsTitle;

    // Update lang button styles if they exist
    const btnTh = document.getElementById('btn-lang-th');
    const btnEn = document.getElementById('btn-lang-en');
    if (btnTh && btnEn) {
        if (currentLang === 'th') {
            btnTh.classList.add('font-bold', 'underline');
            btnEn.classList.remove('font-bold', 'underline');
        } else {
            btnEn.classList.add('font-bold', 'underline');
            btnTh.classList.remove('font-bold', 'underline');
        }
    }
}

// ============================================
// Visual Effects
// ============================================

function startConfetti(emojis) {
    const container = document.getElementById('app');
    if (!container) return;

    // Normalize emojis to array
    const emojiArray = Array.isArray(emojis) ? emojis : [emojis || '✨'];

    // Category-specific emoji rain from top - lots of emojis!
    const emojiCount = 80;

    for (let i = 0; i < emojiCount; i++) {
        setTimeout(() => {
            const span = document.createElement('span');
            const randomEmoji = emojiArray[Math.floor(Math.random() * emojiArray.length)];

            span.textContent = randomEmoji;
            span.className = 'emoji-confetti';
            span.style.cssText = `
                position: absolute;
                top: -50px;
                left: ${Math.random() * 100}%;
                font-size: ${1.5 + Math.random() * 1.5}rem;
                pointer-events: none;
                z-index: 1000;
                animation: emojiFall ${2 + Math.random() * 2}s linear forwards;
                opacity: 0.9;
            `;

            container.appendChild(span);

            // Remove after animation
            setTimeout(() => {
                span.remove();
            }, 5000);
        }, i * 40); // Faster stagger for more intense rain
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
        resultName: result.name, // Will save object
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

    const t = translations[currentLang];

    contentDiv.innerHTML = `
        <div class="text-center w-full fade-in font-['Kanit']">
            <div class="color-wheel-container md:!w-[150px] md:!h-[150px]" style="margin-bottom: 30px;">
                <div class="color-wheel-glow"></div>
                <div class="color-wheel"></div>
                <div class="wheel-pointer"></div>
            </div>
            <h2 class="text-2xl md:text-3xl font-bold text-[#003087] mb-2 md:mb-3">${t.startTitle}</h2>
            <p class="text-gray-500 mb-8 px-4 text-base md:text-lg md:leading-relaxed">
                ${t.startDesc.replace('{count}', questions.length)}
            </p>
            <button onclick="startGame()" class="w-full bg-[#003087] hover:bg-[#002466] text-white py-4 rounded-lg shadow-lg text-lg md:text-xl font-bold transition-all transform hover:scale-[1.02]">
                ${t.startBtn}
            </button>
        </div>
    `;
    updateStaticText();
}

function startGame() {
    sound.playSelect();
    renderQuestion();
}

function renderQuestion() {
    const q = questions[currentQuestionIndex];
    const progress = (currentQuestionIndex / questions.length) * 100;
    const t = translations[currentLang];

    // Shuffle choices for fairness - create array of indices and shuffle them
    const choiceIndices = q.choices.map((_, i) => i);
    shuffledChoices = shuffleArray(choiceIndices);

    let html = `
        <div class="w-full h-full flex flex-col fade-in">
            <div class="flex justify-between items-end mb-2">
                <span class="text-sm font-bold text-[#003087]">${t.question} ${currentQuestionIndex + 1}</span>
                <span class="text-xs text-gray-500">${t.of} ${questions.length}</span>
            </div>
            <div class="progress-container">
                <div class="progress-bar" style="width: ${progress}%"></div>
            </div>

            ${currentQuestionIndex > 0 ? `
            <button onclick="goBack()" class="self-start text-sm text-gray-500 hover:text-[#003087] transition-colors mb-3 flex items-center gap-1">
                <span>←</span> ${t.back}
            </button>
            ` : ''}

            <h3 class="text-xl font-bold text-gray-800 mb-6 leading-relaxed" style="font-size: 1.25rem;">
                ${q.q[currentLang]}
            </h3>

            <div class="space-y-3 flex-1 overflow-y-auto pb-4 custom-scrollbar">
    `;

    // Render choices in shuffled order
    shuffledChoices.forEach((originalIndex, displayIndex) => {
        const choice = q.choices[originalIndex];
        html += `
            <button onclick="selectChoice(${displayIndex})" class="choice-btn w-full text-left group">
                <span class="font-medium text-lg group-hover:text-[#003087] transition-colors">${choice.text[currentLang]}</span>
            </button>
        `;
    });

    html += `</div></div>`;
    contentDiv.innerHTML = html;
}

function selectChoice(displayIndex) {
    sound.playBeep();
    const q = questions[currentQuestionIndex];

    // Map display index back to original choice index
    const originalIndex = shuffledChoices[displayIndex];
    const selectedChoice = q.choices[originalIndex];

    // Store this answer for potential back navigation
    answerHistory.push({
        questionIndex: currentQuestionIndex,
        choiceIndex: originalIndex, // Store original index
        score: { ...selectedChoice.score }
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
    const t = translations[currentLang];

    saveToHistory(result);
    saveResultToDatabase(result);

    // Trigger Confetti
    startConfetti(result.confettiEmoji || '✨');

    contentDiv.innerHTML = `
        <div class="w-full h-full flex flex-col items-center text-center scale-in overflow-y-auto pb-8 font-['Kanit']">
            <div class="text-sm font-bold text-gray-500 mb-2 uppercase tracking-widest">${t.resultTitle}</div>

            <div class="text-8xl mb-4 filter drop-shadow-md">${result.icon}</div>

            <h2 class="text-3xl font-black ${result.textClass} mb-2 leading-tight">
                ${result.name[currentLang]}
            </h2>

            <div class="result-card mb-6 w-full bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <p class="leading-relaxed text-lg text-gray-700">
                    "${result.desc[currentLang]}"
                </p>
            </div>

            <div class="grid grid-cols-2 gap-3 w-full mb-4">
                <button onclick="goBackFromResult()" class="bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-bold transition-colors">
                    ← ${t.edit}
                </button>
                <button onclick="showStats()" class="bg-[#003087] hover:bg-[#002466] text-white py-3 rounded-lg font-bold transition-colors">
                    📊 ${t.stats}
                </button>
            </div>

            <button onclick="renderStartScreen()" class="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-bold transition-colors">
                🔄 ${t.playAgain}
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
    const t = translations[currentLang];

    let html = `
        <div class="w-full h-full flex flex-col fade-in font-['Kanit']">
            <h2 class="text-xl font-bold text-[#003087] mb-6 text-center">📊 ${t.globalStatsTitle}</h2>
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
                        <span>${cat.icon}</span> ${cat.name[currentLang]}
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
                ⬅ ${t.backHome}
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

    updateStaticText();

    // Check for shared result
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