"use client";

import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from "recharts";
import { motion } from "framer-motion";

const data = [
    { subject: 'Elegancia', A: 145, fullMark: 150 },
    { subject: 'Comodidad', A: 138, fullMark: 150 },
    { subject: 'Durabilidad', A: 140, fullMark: 150 },
    { subject: 'Acabado', A: 148, fullMark: 150 },
    { subject: 'Prestigio', A: 142, fullMark: 150 },
    { subject: 'Versatilidad', A: 135, fullMark: 150 },
];

export default function Features() {
    return (
        <section className="relative z-10 py-24 bg-black/90 backdrop-blur-sm text-white border-t border-white/10">
            <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h3 className="text-primary font-bold uppercase tracking-widest mb-2">Métricas de Excelencia</h3>
                    <h2 className="font-heading text-4xl md:text-6xl font-bold mb-6">CALIDAD<br />SUPERIOR</h2>
                    <p className="text-gray-400 text-lg mb-6 leading-relaxed">
                        Cada par de zapatos Vierco es meticulosamente elaborado con los materiales más finos.
                        Diseñados para ejecutivos que exigen lo mejor sin compromisos.
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 border border-primary/30 rounded bg-primary/5">
                            <div className="text-3xl font-bold text-primary">100%</div>
                            <div className="text-xs text-gray-500 uppercase tracking-wider">Cuero Genuino</div>
                        </div>
                        <div className="p-4 border border-white/10 rounded bg-white/5">
                            <div className="text-3xl font-bold text-white">Premium</div>
                            <div className="text-xs text-gray-500 uppercase tracking-wider">Hecho a Mano</div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    className="h-[400px] w-full"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                            <PolarGrid stroke="#333" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#888', fontSize: 12 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                            <Radar
                                name="Vierco Élite"
                                dataKey="A"
                                stroke="#5a6b4a"
                                strokeWidth={3}
                                fill="#5a6b4a"
                                fillOpacity={0.4}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#000', border: '1px solid #5a6b4a', color: '#fff' }}
                                itemStyle={{ color: '#5a6b4a' }}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>
        </section>
    );
}
