import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { DiscussionEmbed } from 'disqus-react';

import MarketHeaderConnector from '../../connectors/MarketHeaderConnector';
import MarketResolutionInfoConenctor from '../../connectors/MarketResolutionInfoConnector';
import MarketStatisticsConnector from '../../connectors/MarketStatisticsConnector';
import TokenSwapperConnector from '../../connectors/TokenSwapperConnector';
import Page from '../../containers/Page';
import { fetchMarketById } from '../../redux/market/marketActions';
import { fetchPricesHistoryByMarketId } from '../../redux/priceHistory/priceHistoryActions';
import trans from '../../translation/trans';
import ActionsCard from '../../components/ActionsCard';
import TabbedView from '../../containers/TabbedViews';
import LiquidityProviderConnector from '../../connectors/LiquidityProviderConnector';

import s from './MarketPage.module.scss';
import { Helmet } from 'react-helmet';
import { Reducers } from '../../redux/reducers';
import { loadTokens } from '../../redux/tokens/tokenActions';
import ClaimFeesConnector from '../../connectors/ClaimFeesConnector';
import SeedPoolConnector from '../../connectors/SeedPoolConnector';

interface RouterParams {
    marketId: string;
}

export default function MarketPage() {
    const dispatch = useDispatch();
    const market = useSelector((store: Reducers) => store.market.marketDetail);
    const { marketId } = useParams<RouterParams>();

    useEffect(() => {
        dispatch(fetchMarketById(marketId));
        dispatch(fetchPricesHistoryByMarketId(marketId));
        dispatch(loadTokens(marketId));
    }, [dispatch, marketId]);

    return (
        <Page hasNavigation size="unrestricted" className={s.root}>
            <Helmet>
                <title>
                    {trans('market.title.head', {
                        appName: trans('global.appName'),
                        description: market?.description || '',
                    })}
                </title>
            </Helmet>
            <MarketHeaderConnector />
            <div className={s.details}>
                <div className={s.infoWrapper}>
                    <MarketStatisticsConnector className={s.stats} />
                    <MarketResolutionInfoConenctor />
                </div>
                <ActionsCard className={s.tokenSwapper}>
                    <TabbedView
                        items={[{
                            element: <TokenSwapperConnector key="tokenswapper" />,
                            label: trans('market.label.swap'),
                            show: market?.public === true && market?.finalized === false,
                            id: '0',
                        }, {
                            element: <LiquidityProviderConnector key="liquidity" />,
                            label: trans('market.label.liquidity'),
                            show: market?.public === true && market?.finalized === false,
                            id: '1',
                        }, {
                            element: <ClaimFeesConnector key="claimfees" />,
                            label: trans('market.label.claimFees'),
                            show: market?.finalized === true,
                            id: '2',
                        }, {
                            element: <SeedPoolConnector key="seedpool" />,
                            label: trans('market.label.seedPool'),
                            show: market?.finalized === false && market.public === false,
                            id: '3',
                        }]}
                    />
                </ActionsCard>
            </div>
            <div className={s.comments}>
                <h2>{trans('global.comments')}</h2>
                <DiscussionEmbed shortname="flux" config={{}} />
            </div>
        </Page>
    );
}
