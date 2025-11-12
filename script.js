'use client';

// =================================================================
// 1. Komponen TextType (React Component)
// =================================================================

import { useEffect, useRef, useState, createElement, useMemo, useCallback } from 'react';
import { gsap } from 'gsap';
import './TextType.css';

const TextType = ({
  text,
  as: Component = 'div',
  typingSpeed = 50,
  initialDelay = 0,
  pauseDuration = 2000,
  deletingSpeed = 30,
  loop = true,
  className = '',
  showCursor = true,
  hideCursorWhileTyping = false,
  cursorCharacter = '|',
  cursorClassName = '',
  cursorBlinkDuration = 0.5,
  textColors = [],
  variableSpeed,
  onSentenceComplete,
  startOnVisible = false,
  reverseMode = false,
  ...props
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(!startOnVisible);
  const cursorRef = useRef(null);
  const containerRef = useRef(null);

  const textArray = useMemo(() => (Array.isArray(text) ? text : [text]), [text]);

  const getRandomSpeed = useCallback(() => {
    if (!variableSpeed) return typingSpeed;
    const { min, max } = variableSpeed;
    return Math.random() * (max - min) + min;
  }, [variableSpeed, typingSpeed]);

  const getCurrentTextColor = () => {
    if (textColors.length === 0) return;
    return textColors[currentTextIndex % textColors.length];
  };

  useEffect(() => {
    if (!startOnVisible || !containerRef.current) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [startOnVisible]);

  useEffect(() => {
    if (showCursor && cursorRef.current) {
      gsap.set(cursorRef.current, { opacity: 1 });
      gsap.to(cursorRef.current, {
        opacity: 0,
        duration: cursorBlinkDuration,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut'
      });
    }
  }, [showCursor, cursorBlinkDuration]);

  useEffect(() => {
    if (!isVisible) return;

    let timeout;
    const currentText = textArray[currentTextIndex];
    const processedText = reverseMode ? currentText.split('').reverse().join('') : currentText;

    const executeTypingAnimation = () => {
      if (isDeleting) {
        if (displayedText === '') {
          setIsDeleting(false);
          if (currentTextIndex === textArray.length - 1 && !loop) {
            return;
          }

          if (onSentenceComplete) {
            onSentenceComplete(textArray[currentTextIndex], currentTextIndex);
          }

          setCurrentTextIndex(prev => (prev + 1) % textArray.length);
          setCurrentCharIndex(0);
          timeout = setTimeout(() => {}, pauseDuration);
        } else {
          timeout = setTimeout(() => {
            setDisplayedText(prev => prev.slice(0, -1));
          }, deletingSpeed);
        }
      } else {
        if (currentCharIndex < processedText.length) {
          timeout = setTimeout(
            () => {
              setDisplayedText(prev => prev + processedText[currentCharIndex]);
              setCurrentCharIndex(prev => prev + 1);
            },
            variableSpeed ? getRandomSpeed() : typingSpeed
          );
        } else if (textArray.length > 1) {
          timeout = setTimeout(() => {
            setIsDeleting(true);
          }, pauseDuration);
        }
      }
    };

    if (currentCharIndex === 0 && !isDeleting && displayedText === '') {
      timeout = setTimeout(executeTypingAnimation, initialDelay);
    } else {
      executeTypingAnimation();
    }

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentCharIndex,
    displayedText,
    isDeleting,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
    textArray,
    currentTextIndex,
    loop,
    initialDelay,
    isVisible,
    reverseMode,
    variableSpeed,
    onSentenceComplete
  ]);

  const shouldHideCursor =
    hideCursorWhileTyping && (currentCharIndex < textArray[currentTextIndex].length || isDeleting);

  return createElement(
    Component,
    {
      ref: containerRef,
      className: `text-type ${className}`,
      ...props
    },
    <span className="text-type__content" style={{ color: getCurrentTextColor() || 'inherit' }}>
      {displayedText}
    </span>,
    showCursor && (
      <span
        ref={cursorRef}
        className={`text-type__cursor ${cursorClassName} ${shouldHideCursor ? 'text-type__cursor--hidden' : ''}`}
      >
        {cursorCharacter}
      </span>
    )
  );
};

export default TextType;


// =================================================================
// 2. Logika Vanilla JavaScript/jQuery
// =================================================================

document.addEventListener('DOMContentLoaded', function() {
  // Nomor WhatsApp Anda (085136236798 diubah ke format internasional 6285136236798)
  const whatsappNumber = '6285136236798'; 
  const villaNameDisplay = document.getElementById('selectedVillaName');
  const hiddenVillaNameInput = document.getElementById('hiddenVillaName');
  const bookingForm = document.getElementById('bookingForm');

  // 1. Logika untuk Memilih Villa (Saat tombol 'Pesan Villa Ini' di klik)
  const selectVillaButtons = document.querySelectorAll('.select-villa');

  selectVillaButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const villaName = this.getAttribute('data-villa');
      
      // Perbarui tampilan di formulir pemesanan
      villaNameDisplay.textContent = villaName;
      hiddenVillaNameInput.value = villaName;

      // Lakukan smooth scrolling ke bagian pemesanan
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });

  // 2. Logika Pengiriman Formulir ke WhatsApp
  bookingForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Ambil nilai dari input form
    const villaName = hiddenVillaNameInput.value;
    const fullName = document.getElementById('fullName').value;
    const phone = document.getElementById('phone').value;
    const checkIn = document.getElementById('checkIn').value;
    const checkOut = document.getElementById('checkOut').value;
    const guests = document.getElementById('guests').value;

    // Validasi: pastikan villa sudah dipilih
    if (!villaName || villaName === '-- Belum Ada Villa yang Dipilih --') {
      alert('⚠️ Mohon pilih villa yang ingin Anda pesan terlebih dahulu pada bagian "Villa Kami".');
      return;
    }

    // Buat pesan WhatsApp
    const message = 
      `*FORMULIR PEMESANAN VILLA - HOLIDAY*\n\n` +
      `*Villa Pilihan:* ${villaName}\n` +
      `*Nama Pemesan:* ${fullName}\n` +
      `*No. Telp:* ${phone}\n` +
      `*Check-In:* ${checkIn}\n` +
      `*Check-Out:* ${checkOut}\n` +
      `*Jumlah Tamu:* ${guests} orang\n\n` +
      `Halo, saya ingin melanjutkan proses pemesanan villa ini. Mohon info lebih lanjut mengenai ketersediaan dan total harga. Terima kasih.`;

    // Encode pesan dan buat URL WhatsApp
    const encodedMessage = encodeURIComponent(message);
    
    // Bersihkan format nomor telepon
    const cleanNumber = whatsappNumber.replace(/\s|-/g, ''); 
    
    const whatsappURL = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;

    // Arahkan pengguna ke WhatsApp
    window.open(whatsappURL, '_blank');
  });

  // 3. Smooth Scrolling untuk Navigasi
  document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });
});
