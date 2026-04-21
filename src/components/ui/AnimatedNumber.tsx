"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export default function AnimatedNumber({
  value,
  duration = 2,
  prefix = "",
  suffix = "",
  className = "",
}: AnimatedNumberProps) {
  const spring = useSpring(0, {
    stiffness: 50,
    damping: 30,
    duration: duration * 1000,
  });
  const display = useTransform(spring, (latest) =>
    `${prefix}${latest.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}${suffix}`
  );

  return (
    <motion.span className={className}>
      {display}
    </motion.span>
  );
}