/*
|-----------------------------------------
| setting up Loading for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import React from 'react';
import { motion } from 'framer-motion';

interface FullPageLoaderProps {
  bgColor?: string;
  accentColor?: string;
  message?: string;
}

const AnimatedCircle: React.FC<{
  className: string;
  style: React.CSSProperties;
  animate: import('framer-motion').TargetAndTransition;
  transition: object;
}> = ({ className, style, animate, transition }) => <motion.div className={className} style={style} animate={animate} transition={transition} />;

const LoadingComponent: React.FC<FullPageLoaderProps> = ({ accentColor = '#10b981', message = 'Please wait...' }) => {
  const circleStyle = { borderColor: accentColor };
  const dotStyle = { backgroundColor: accentColor };

  return (
    <div className="min-h-screen bg-blue-600/20 w-full fixed top-0 left-0 inset-0 flex flex-col items-center justify-center z-[1000] backdrop-blur-[8px]">
      <motion.div
        className="p-8 rounded-2xl backdrop-blur-xl bg-white/10 flex flex-col items-center border border-white/20 shadow-2xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <div className="relative h-24 w-24">
          <AnimatedCircle
            className="absolute inset-0 rounded-full border-t-4 border-b-4"
            style={circleStyle}
            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />

          <AnimatedCircle
            className="absolute inset-2 rounded-full border-r-4 border-l-4"
            style={circleStyle}
            animate={{ rotate: -360, scale: [1, 0.8, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />

          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ backgroundColor: accentColor, opacity: 0.1 }}
            animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          />

          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ scale: [0.8, 1.1, 0.8] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="h-4 w-4 rounded-full" style={dotStyle} />
          </motion.div>

          <motion.div className="absolute inset-0" animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}>
            <div className="absolute w-2 h-2 rounded-full -top-1 left-1/2 transform -translate-x-1/2" style={{ backgroundColor: accentColor, opacity: 0.6 }} />
            <div
              className="absolute w-2 h-2 rounded-full -bottom-1 left-1/2 transform -translate-x-1/2"
              style={{ backgroundColor: accentColor, opacity: 0.6 }}
            />
          </motion.div>
        </div>

        <motion.p
          className="mt-6 text-white font-medium text-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {message}
        </motion.p>

        <motion.div
          className="mt-4 w-32 h-1 rounded-full overflow-hidden bg-white/20"
          initial={{ width: 0 }}
          animate={{ width: 128 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: 'linear',
            }}
            className="h-full w-1/2 rounded-full"
            style={{ backgroundColor: accentColor }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoadingComponent;
