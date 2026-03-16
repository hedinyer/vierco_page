/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SortableItem(props: any) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: props.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="p-4 mb-2 bg-white/5 border border-primary/20 rounded cursor-grab active:cursor-grabbing hover:bg-primary/10 transition-colors flex items-center justify-between">
            <span className="font-bold text-white">{props.id}</span>
            <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: props.color }}></div>
        </div>
    );
}

export default function Customizer() {
    const [items, setItems] = useState(['Negro Elegante', 'Verde Musgo', 'Blanco Marfil', 'Café Premium']);
    const colors: Record<string, string> = {
        'Negro Elegante': '#000000',
        'Verde Musgo': '#5a6b4a',
        'Blanco Marfil': '#fafafa',
        'Café Premium': '#3e2723'
    };

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function handleDragEnd(event: any) {
        const { active, over } = event;

        if (active.id !== over.id) {
            setItems((items) => {
                const oldIndex = items.indexOf(active.id);
                const newIndex = items.indexOf(over.id);

                return arrayMove(items, oldIndex, newIndex);
            });
        }
    }

    return (
        <section className="relative z-10 py-24 bg-black text-white border-t border-white/10">
            <div className="container mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">PERSONALIZA TU ESTILO</h2>
                    <p className="text-gray-500 mb-12 max-w-xl mx-auto">
                        Elige tu combinación de colores preferida. Cada acabado está diseñado para complementar tu guardarropa empresarial.
                    </p>
                </motion.div>

                <div className="max-w-md mx-auto">
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={items}
                            strategy={verticalListSortingStrategy}
                        >
                            {items.map(id => <SortableItem key={id} id={id} color={colors[id]} />)}
                        </SortableContext>
                    </DndContext>

                    <p className="mt-8 text-gray-500 text-sm">
                        Arrastra para ordenar tus preferencias de color.
                    </p>
                </div>
            </div>
        </section>
    );
}
