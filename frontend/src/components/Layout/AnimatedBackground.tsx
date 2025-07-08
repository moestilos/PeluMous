import React, { useEffect, useRef } from 'react';

const AnimatedBackground: React.FC = () => {
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const createParticle = () => {
      if (!backgroundRef.current) return;

      const particle = document.createElement('div');
      const sizes = ['small', 'medium', 'large'];
      const size = sizes[Math.floor(Math.random() * sizes.length)];
      
      particle.className = `particle ${size}`;
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 2 + 's';
      particle.style.animationDuration = (6 + Math.random() * 4) + 's';
      
      backgroundRef.current.appendChild(particle);

      // Remover la partícula después de la animación
      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, 10000);
    };

    const createStar = () => {
      if (!backgroundRef.current) return;

      const star = document.createElement('div');
      star.className = 'star';
      star.style.left = Math.random() * 100 + '%';
      star.style.top = Math.random() * 100 + '%';
      star.style.animationDelay = Math.random() * 4 + 's';
      
      backgroundRef.current.appendChild(star);

      // Remover la estrella después de la animación
      setTimeout(() => {
        if (star.parentNode) {
          star.parentNode.removeChild(star);
        }
      }, 4000);
    };

    const createBeautyElement = () => {
      if (!backgroundRef.current) return;

      const element = document.createElement('div');
      const types = ['scissors', 'sparkle', 'flower'];
      const type = types[Math.floor(Math.random() * types.length)];
      
      element.className = `beauty-element ${type}`;
      element.style.left = Math.random() * 100 + '%';
      element.style.top = Math.random() * 100 + '%';
      element.style.animationDelay = Math.random() * 5 + 's';
      
      backgroundRef.current.appendChild(element);

      // Remover el elemento después de la animación
      setTimeout(() => {
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
      }, 12000);
    };

    // Crear partículas iniciales
    for (let i = 0; i < 15; i++) {
      setTimeout(createParticle, i * 200);
    }

    // Crear estrellas iniciales
    for (let i = 0; i < 8; i++) {
      setTimeout(createStar, i * 500);
    }

    // Crear elementos de belleza iniciales
    for (let i = 0; i < 6; i++) {
      setTimeout(createBeautyElement, i * 1000);
    }

    // Intervalos para crear nuevos elementos
    const particleInterval = setInterval(createParticle, 800);
    const starInterval = setInterval(createStar, 2000);
    const beautyInterval = setInterval(createBeautyElement, 3000);

    return () => {
      clearInterval(particleInterval);
      clearInterval(starInterval);
      clearInterval(beautyInterval);
    };
  }, []);

  return (
    <>
      <div className="animated-background">
        <div className="beauty-particles" ref={backgroundRef}>
          {/* Ondas de fondo */}
          <div className="wave"></div>
          <div className="wave"></div>
          <div className="wave"></div>
        </div>
      </div>
      <div className="beauty-shimmer"></div>
    </>
  );
};

export default AnimatedBackground;
