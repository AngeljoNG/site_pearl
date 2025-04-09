import React from 'react';
import { motion } from 'framer-motion';
import { PenTool } from 'lucide-react';

interface WritingQuillProps {
  text?: string;
  className?: string;
}

export function WritingQuill({ text = "Graphothérapie", className = "" }: WritingQuillProps) {
  const pathRef = React.useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = React.useState(0);

  React.useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, []);

  const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 2, ease: "easeInOut" },
        opacity: { duration: 0.01 }
      }
    }
  };

  const penVariants = {
    hidden: { x: "0%", y: "0%" },
    visible: {
      x: "100%",
      y: ["0%", "-2%", "0%", "2%", "0%"],
      transition: {
        x: { duration: 2, ease: "easeInOut" },
        y: { duration: 2, ease: "easeInOut", repeat: Infinity }
      }
    }
  };

  return (
    <div className={`relative h-32 my-12 ${className}`}>
      {/* Pen animation */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={penVariants}
        className="absolute left-0 top-1/2 -translate-y-1/2 transform -rotate-45"
      >
        <div className="relative w-12 h-12">
          <PenTool className="w-full h-full text-grapho-orange" />
          <motion.div
            className="absolute -bottom-1 -right-1 w-1 h-1 bg-grapho-orange rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </motion.div>

      {/* Writing path */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 800 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.path
          ref={pathRef}
          d={`M 100 50 Q 200 20, 300 50 T 500 50 T 700 50`}
          stroke="currentColor"
          strokeWidth="2"
          className="text-grapho-orange/30"
          initial="hidden"
          animate="visible"
          variants={draw}
        />
      </svg>

      {/* Text animation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: [0, 1, 1, 0],
          y: [20, 0, 0, -20]
        }}
        transition={{
          duration: 2,
          times: [0, 0.2, 0.8, 1],
          repeat: Infinity,
          repeatDelay: 0.5
        }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <span 
          className="text-3xl font-['Dancing_Script'] text-grapho-orange"
          style={{ fontFamily: "'Dancing Script', cursive" }}
        >
          {text}
        </span>
      </motion.div>
    </div>
  );
}