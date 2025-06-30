// 아티클 리스트 링크 업데이트 (간소화된 버전)
function updateArticleListLinks(lang) {
    const isEnglish = lang === "en";
    const postLinks = document.querySelectorAll('.post-item a[itemprop="headline"], .post-item a.item__header');
    
    // 일관된 URL 패턴: /category/YYYY/MM/DD/slug(-en).html
    const postPattern = /^\/([a-zA-Z0-9_-]+)\/(\d{4}\/\d{2}\/\d{2}\/[^\/]+?)(?:-en)?(?:\.html)?$/;

    postLinks.forEach(link => {
        const originalHref = link.getAttribute('data-original-href') || link.href;
        if (!link.hasAttribute('data-original-href')) {
            link.setAttribute('data-original-href', originalHref);
        }

        const match = originalHref.match(postPattern);
        if (!match) {
            console.warn(`[updateArticleListLinks] Could not parse slug from URL: ${originalHref}`);
            return;
        }
        const category = match[1]; // work, blog 등
        const baseSlug = match[2]; // YYYY/MM/DD/slug
        let newHref = '';
        if (isEnglish) {
            newHref = `/${category}/${baseSlug}-en.html`;
        } else {
            newHref = `/${category}/${baseSlug}.html`;
        }
        link.href = newHref;
    });
}

// Lang Toggle on/off시 Redirection
function maybeRedirectOnLang(lang) {
  const currentPath = window.location.pathname;
  let newPath = currentPath;

  // 홈 페이지는 리디렉션하지 않음
  if (currentPath === '/' || currentPath === '/index.html') {
    return;
  }

  // 일관된 패턴 매칭
  const postPathMatch = currentPath.match(/^\/([a-zA-Z0-9_-]+)\/(\d{4}\/\d{2}\/\d{2}\/[^\/]+?)(?:-en)?(?:\.html)?$/);

  if (postPathMatch) {
    const category = postPathMatch[1];
    const baseSlug = postPathMatch[2];

    if (lang === 'en') {
      const targetPath = `/${category}/${baseSlug}-en.html`;

      // 파일 존재 여부를 HEAD 요청으로 확인
      fetch(targetPath, { method: 'HEAD' })
        .then(response => {
          if (response.ok) {
            // 파일이 존재하면 리디렉션
            if (!currentPath.endsWith('-en.html')) {
              window.location.href = targetPath;
            }
          } else {
            console.log(`[maybeRedirectOnLang] No EN version found for: ${targetPath}, staying on current page.`);
          }
        })
      .catch(err => {
        console.warn(`[maybeRedirectOnLang] Error checking EN version: ${err}`);
      });
    } else {
      if (currentPath.endsWith('-en.html')) {
        newPath = `/${category}/${baseSlug}.html`;
      }
    }

    if (newPath !== currentPath) {
      window.location.href = newPath;
    }
  }
}

// 가시성 제어 로직도 더 간단해짐
function updateArticleListVisibility(lang) {
  const isEnglish = lang === "en";
  const postItems = document.querySelectorAll('.post-item');

  // console.log(`[updateArticleListVisibility] Current language: ${lang}`);
  // console.log(`[updateArticleListVisibility] Total post items found: ${postItems.length}`);

  // 모든 포스트 아이템을 기본적으로 숨김
  postItems.forEach(item => {
    item.classList.add('lang-hidden');
    item.style.display = 'none';
  });

  const groupedPosts = new Map();

  postItems.forEach(item => {
    const itemLang = item.getAttribute('data-lang') || 'ko';
    let itemRef = item.getAttribute('data-ref');
    
    // URL에서 ref 추출 (더 강력한 방식)
    const href = item.querySelector('a')?.getAttribute('href') || '';
    let extractedRef = null;
    
    // 패턴 1: /category/YYYY/MM/DD/slug(-en).html
    let slugMatch = href.match(/^\/[^\/]+\/\d{4}\/\d{2}\/\d{2}\/([^\/]+?)(?:-en)?(?:\.html)?$/);
    if (slugMatch) {
      extractedRef = slugMatch[1];
    } else {
      // 패턴 2: 단순 파일명 /slug(-en).html
      slugMatch = href.match(/\/([^\/]+?)(?:-en)?(?:\.html)?$/);
      if (slugMatch) {
        extractedRef = slugMatch[1];
      }
    }

    // ref 결정 우선순위:
    // 1. data-ref가 있고 -en으로 끝나지 않으면 사용
    // 2. 없거나 -en으로 끝나면 URL에서 추출한 값 사용
    let effectiveRef = itemRef;
    if (!effectiveRef || effectiveRef.endsWith('-en')) {
      effectiveRef = extractedRef;
    }

    const itemTitle = item.querySelector('.item__header, .card__header')?.textContent || 'No Title';
    
    // console.log(`Processing: "${itemTitle}"`);
    // console.log(`  - Lang: ${itemLang}`);
    // console.log(`  - data-ref: ${itemRef}`);
    // console.log(`  - href: ${href}`);
    // console.log(`  - extracted ref: ${extractedRef}`);
    // console.log(`  - effective ref: ${effectiveRef}`);

    if (!effectiveRef) {
      console.warn(`Could not determine effective ref for: ${itemTitle}`);
      return;
    }

    if (!groupedPosts.has(effectiveRef)) {
      groupedPosts.set(effectiveRef, { ko: null, en: null });
    }
    groupedPosts.get(effectiveRef)[itemLang] = item;
  });

  // console.log("Grouped posts:", groupedPosts);

  // 가시성 결정
  groupedPosts.forEach((pair, ref) => {
    const itemKo = pair.ko;
    const itemEn = pair.en;

    // console.log(`Deciding visibility for ref "${ref}": KO=${!!itemKo}, EN=${!!itemEn}`);

    let itemToShow = null;
    let itemToHide = null;

    if (isEnglish) {
      // 영어 모드: 영어 버전만 표시
      if (itemEn) {
        itemToShow = itemEn;
        itemToHide = itemKo;
        // console.log(`  -> Showing EN version for "${ref}"`);
      } 
      else {
        // console.log(`  -> No version available for "${ref}", hiding`)
      }
    } else {
      // 한국어 모드: 한국어 버전만 표시
      if (itemKo) {
        itemToShow = itemKo;
        itemToHide = itemEn;
        // console.log(`  -> Showing KO version for "${ref}"`);
      } else {
        // console.log(`  -> No KO version for "${ref}", hiding`);
      }
    }

    if (itemToShow) {
      itemToShow.classList.remove('lang-hidden');
      itemToShow.style.display = '';
    }
    if (itemToHide) {
    itemToHide.classList.add('lang-hidden');
    itemToHide.style.display = 'none';
    }
  });

  const visibleItems = document.querySelectorAll('.post-item:not(.lang-hidden)');
  // console.log(`Total visible items: ${visibleItems.length}`);
}

// Function: updateLanguageUI
function updateLanguageUI(lang) {
  const isEnglish = lang === "en";
  
  // 토글 스위치 상태 업데이트
  const toggle = document.getElementById("lang-toggle");
  if (toggle) {
    toggle.checked = isEnglish;
  }
  
  // 언어별 텍스트 업데이트
  const langTexts = document.querySelectorAll('[data-lang-text]');
  langTexts.forEach(element => {
    const texts = element.getAttribute('data-lang-text').split('|');
    if (texts.length >= 2) {
      element.textContent = isEnglish ? texts[1] : texts[0];
    }
  });
  
  // 언어별 요소 표시/숨김 (data-show-lang 속성 사용)
  const langElements = document.querySelectorAll('[data-show-lang]');
  langElements.forEach(element => {
    const showLang = element.getAttribute('data-show-lang');
    if (showLang === lang) {
      element.style.display = '';
      element.classList.remove('lang-hidden');
    } else {
      element.style.display = 'none';
      element.classList.add('lang-hidden');
    }
  });
  
  // .lang-ko와 .lang-en 클래스 기반 언어 전환
  const koElements = document.querySelectorAll('.lang-ko');
  const enElements = document.querySelectorAll('.lang-en');
  
  if (isEnglish) {
    // 영어 모드: .lang-en 표시, .lang-ko 숨김
    koElements.forEach(el => {
      el.style.display = 'none';
      el.classList.add('lang-hidden');
    });
    enElements.forEach(el => {
      el.style.display = '';
      el.classList.remove('lang-hidden');
    });
  } else {
    // 한국어 모드: .lang-ko 표시, .lang-en 숨김
    koElements.forEach(el => {
      el.style.display = '';
      el.classList.remove('lang-hidden');
    });
    enElements.forEach(el => {
      el.style.display = 'none';
      el.classList.add('lang-hidden');
    });
  }
  // 검색창 관련 업데이트
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.placeholder = isEnglish ? "Search" : "검색";
  }

  // 아티클 리스트 업데이트 
  updateArticleListLinks(lang);
  updateArticleListVisibility(lang);

  // HTML lang 속성 업데이트
  document.documentElement.lang = isEnglish ? 'en' : 'ko';

  setTimeout(() => {
    document.body.style.visibility = 'visible'; // 렌더 완료 후 다시 보여줌
  }, 0); // 또는 50~100ms로 조정 가능

  // console.log(`Language UI updated to: ${lang}`);
}

// --- Initialization ---
function waitForToggleAndInit() {
  const toggle = document.getElementById("lang-toggle");
  if (toggle) {
    const savedLang = localStorage.getItem("lang") || "ko";
    
    // console.log(`Initializing with saved language: ${savedLang}`);
    
    // UI 초기화 (아티클 리스트 업데이트 포함)
    updateLanguageUI(savedLang);
    
    // URL 리디렉션 (필요한 경우)
    maybeRedirectOnLang(savedLang);

    // 토글 이벤트 리스너
    toggle.addEventListener("change", () => {
      const newLang = toggle.checked ? "en" : "ko";
      // console.log(`Language changed to: ${newLang}`);
      
      localStorage.setItem("lang", newLang);
      
      // UI 업데이트 (아티클 리스트 업데이트 포함)
      updateLanguageUI(newLang);
      
      // URL 리디렉션 (필요한 경우)
      maybeRedirectOnLang(newLang);
    });
    
    // console.log("Language toggle initialized successfully");
  } else {
    // 토글 요소가 없으면 재시도
    requestAnimationFrame(waitForToggleAndInit);
  }
}

// DOM 로드 완료 후 초기화
document.addEventListener("DOMContentLoaded", () => {
  // console.log("DOM loaded, initializing language system...");
  waitForToggleAndInit();
});

// 전역 함수로 노출 (디버깅용)
window.switchLanguage = function(lang) {
  localStorage.setItem("lang", lang);
  updateLanguageUI(lang);
  maybeRedirectOnLang(lang);
};

window.getCurrentLang = function() {
  return localStorage.getItem("lang") || "ko";
};