// AOS 초기화
AOS.init({
    duration: 1000,
    once: true
});

// 스크롤 시 네비게이션 바 스타일 변경
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    } else {
        navbar.style.background = 'white';
        navbar.style.boxShadow = 'none';
    }
});

// 모바일 메뉴 토글
const menuButton = document.querySelector('.menu-button');
const navLinks = document.querySelector('.nav-links');

if (menuButton) {
    menuButton.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// 이미지 로딩 최적화
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
});

// 부드러운 스크롤
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// 게시판 기능
document.addEventListener('DOMContentLoaded', function() {
    const commentForm = document.querySelector('.comment-form');
    const commentsList = document.querySelector('.comments-list');
    const likeButtons = document.querySelectorAll('.like-button');

    // 댓글 작성
    if (commentForm) {
        commentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const textarea = this.querySelector('textarea');
            const content = textarea.value.trim();
            
            if (content) {
                const now = new Date();
                const dateStr = now.toISOString().split('T')[0];
                
                const comment = document.createElement('div');
                comment.className = 'comment';
                comment.setAttribute('data-aos', 'fade-up');
                
                comment.innerHTML = `
                    <div class="comment-header">
                        <span class="comment-author">익명</span>
                        <span class="comment-date">${dateStr}</span>
                    </div>
                    <p class="comment-content">${content}</p>
                    <div class="comment-actions">
                        <button class="like-button">❤️ 0</button>
                    </div>
                `;
                
                commentsList.insertBefore(comment, commentsList.firstChild);
                textarea.value = '';
                
                // 새로 추가된 좋아요 버튼에 이벤트 리스너 추가
                const newLikeButton = comment.querySelector('.like-button');
                newLikeButton.addEventListener('click', handleLike);
            }
        });
    }

    // 좋아요 기능
    function handleLike() {
        const likeCount = parseInt(this.textContent.match(/\d+/)[0]);
        this.textContent = `❤️ ${likeCount + 1}`;
        this.style.color = '#dc2626';
    }

    likeButtons.forEach(button => {
        button.addEventListener('click', handleLike);
    });
});

// Three.js 초기화
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#sphereCanvas'),
    alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);

// 구체들을 저장할 배열
const spheres = [];
const colors = [
    0xff6b6b, // 산호색
    0xffd93d, // 노란색
    0x6c5ce7, // 보라색
    0x00b894, // 민트색
    0xff9ff3, // 분홍색
    0xfeca57, // 황금색
    0x1dd1a1, // 청록색
    0xff9f43, // 주황색
    0x54a0ff, // 하늘색
    0x5f27cd  // 진보라색
];
const maxSpheres = 30;

// 구체 생성 함수
function createSphere() {
    const geometry = new THREE.SphereGeometry(
        Math.random() * 0.8 + 0.2,
        32,
        32
    );
    const material = new THREE.MeshPhongMaterial({
        color: colors[Math.floor(Math.random() * colors.length)],
        transparent: true,
        opacity: 0.8,
        shininess: 100
    });
    const sphere = new THREE.Mesh(geometry, material);
    
    // 랜덤 위치 설정 (범위도 약간 확장)
    sphere.position.x = (Math.random() - 0.5) * 18;
    sphere.position.y = (Math.random() - 0.5) * 18;
    sphere.position.z = (Math.random() - 0.5) * 18;
    
    // 속도 설정 (더 빠르게)
    sphere.velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.05,
        (Math.random() - 0.5) * 0.05,
        (Math.random() - 0.5) * 0.05
    );
    
    scene.add(sphere);
    spheres.push(sphere);
}

// 조명 설정
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

camera.position.z = 5;

// 3D 텍스트 관련 변수
const texts = ['UI', 'UX', '3D', 'App', 'Web', 'AI', 'Analysis','Data'];
const textObjects = [];
let font;

// 폰트 로드
const fontLoader = new THREE.FontLoader();
fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function(loadedFont) {
    font = loadedFont;
    // 초기 텍스트 생성
    for (let i = 0; i < 3; i++) {
        createText();
    }
});

// 3D 텍스트 생성 함수
function createText() {
    if (!font) return;

    const text = texts[Math.floor(Math.random() * texts.length)];
    const textGeometry = new THREE.TextGeometry(text, {
        font: font,
        size: 0.5,
        height: 0.2,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5
    });

    const textMaterial = new THREE.MeshPhongMaterial({
        color: colors[Math.floor(Math.random() * colors.length)],
        transparent: true,
        opacity: 0.9,
        shininess: 100
    });

    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    
    // 텍스트 중앙 정렬
    textGeometry.computeBoundingBox();
    const textWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;
    textMesh.position.x = -textWidth / 2;

    // 랜덤 위치 설정
    textMesh.position.x = (Math.random() - 0.5) * 15;
    textMesh.position.y = (Math.random() - 0.5) * 15;
    textMesh.position.z = (Math.random() - 0.5) * 15;

    // 속도 설정
    textMesh.velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.03,
        (Math.random() - 0.5) * 0.03,
        (Math.random() - 0.5) * 0.03
    );

    // 생성 시간 기록
    textMesh.createdAt = Date.now();
    textMesh.lifespan = 5000; // 5초 후 사라짐

    scene.add(textMesh);
    textObjects.push(textMesh);
}

// 애니메이션 함수
function animate() {
    requestAnimationFrame(animate);
    
    // 구체 움직임 업데이트
    spheres.forEach((sphere, index) => {
        sphere.position.add(sphere.velocity);
        
        if (Math.abs(sphere.position.x) > 9) sphere.velocity.x *= -1;
        if (Math.abs(sphere.position.y) > 9) sphere.velocity.y *= -1;
        if (Math.abs(sphere.position.z) > 9) sphere.velocity.z *= -1;
        
        sphere.rotation.x += 0.02;
        sphere.rotation.y += 0.02;
    });
    
    // 텍스트 움직임 및 투명도 업데이트
    textObjects.forEach((textMesh, index) => {
        textMesh.position.add(textMesh.velocity);
        
        if (Math.abs(textMesh.position.x) > 9) textMesh.velocity.x *= -1;
        if (Math.abs(textMesh.position.y) > 9) textMesh.velocity.y *= -1;
        if (Math.abs(textMesh.position.z) > 9) textMesh.velocity.z *= -1;
        
        textMesh.rotation.x += 0.01;
        textMesh.rotation.y += 0.01;

        // 수명 체크 및 페이드 아웃
        const age = Date.now() - textMesh.createdAt;
        if (age > textMesh.lifespan) {
            scene.remove(textMesh);
            textObjects.splice(index, 1);
        } else if (age > textMesh.lifespan * 0.7) {
            // 페이드 아웃 효과
            textMesh.material.opacity = 1 - (age - textMesh.lifespan * 0.7) / (textMesh.lifespan * 0.3);
        }
    });

    // 새로운 구체 생성
    if (spheres.length < maxSpheres && Math.random() < 0.05) {
        createSphere();
    }
    
    // 새로운 텍스트 생성
    if (Math.random() < 0.02) {
        createText();
    }
    
    // 오래된 구체 제거
    if (spheres.length > maxSpheres) {
        const oldSphere = spheres.shift();
        scene.remove(oldSphere);
    }
    
    renderer.render(scene, camera);
}

// 창 크기 조절 대응
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// 초기 구체 생성 (더 많은 구체로 시작)
for (let i = 0; i < 15; i++) {
    createSphere();
}

// 애니메이션 시작
animate(); 
