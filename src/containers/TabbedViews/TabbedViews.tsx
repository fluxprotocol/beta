import React, { useEffect, useState } from 'react';
import SwipeableViews from 'react-swipeable-views';

import TabBar, { TabBarItem } from '../TabBar/TabBar';

import s from './TabbedViews.module.scss';

interface ViewItem extends TabBarItem {
    element: React.ReactNode;
}

interface Props {
    items: ViewItem[];
}

export default function TabbedView({
    items,
}: Props) {
    const [activeId, setActiveId] = useState(0);
    const availableItems = items.filter(item => item.show);
    const activeItem = availableItems[activeId];

    function handleTabClick(item: TabBarItem) {
        const itemIndex = availableItems.findIndex(i => i.id === item.id);
        setActiveId(itemIndex);
    }

    function handleIndexChange(index: number) {
        setActiveId(index);
    }

    return (
        <div>
            <TabBar
                items={availableItems}
                variant="fullWidth"
                onTabClick={handleTabClick}
                activeId={activeItem?.id || ""}
                className={s.tabs}
            />
            <SwipeableViews index={activeId} onChangeIndex={handleIndexChange}>
                {availableItems.map(item => item.element)}
            </SwipeableViews>
        </div>
    );
}
