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
    const [activeId, setActiveId] = useState(parseInt(items[0].id, 10));

    function handleTabClick(item: TabBarItem) {
        setActiveId(parseInt(item.id, 10));
    }

    function handleIndexChange(index: number) {
        setActiveId(index);
    }

    useEffect(() => {
        const item = items.find(item => item.show);

        if (item) {
            setActiveId(parseInt(item.id, 10));
        }
    }, [items]);

    return (
        <div>
            <TabBar
                items={items}
                variant="fullWidth"
                onTabClick={handleTabClick}
                activeId={activeId.toString()}
                className={s.tabs}
            />
            <SwipeableViews index={activeId} onChangeIndex={handleIndexChange}>
                {items.map(item => item.element)}
            </SwipeableViews>
        </div>
    );
}
