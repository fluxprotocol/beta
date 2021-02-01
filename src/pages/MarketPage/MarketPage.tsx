import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { DiscussionEmbed } from 'disqus-react';
import { Helmet } from 'react-helmet';

import MarketHeaderConnector from '../../connectors/MarketHeaderConnector';
import MarketResolutionInfoConenctor from '../../connectors/MarketResolutionInfoConnector';
import MarketStatisticsConnector from '../../connectors/MarketStatisticsConnector';
import TokenSwapperConnector from '../../connectors/TokenSwapperConnector';
import Page from '../../containers/Page';
import { fetchMarketById } from '../../redux/market/marketActions';
import trans from '../../translation/trans';
import ActionsCard from '../../components/ActionsCard';
import TabbedView from '../../containers/TabbedViews';
import LiquidityProviderConnector from '../../connectors/LiquidityProviderConnector';
import { Reducers } from '../../redux/reducers';
import ClaimEarningsConnector from '../../connectors/ClaimEarningsConnector';
import SeedPoolConnector from '../../connectors/SeedPoolConnector';
import MarketClosed from '../../containers/MarketClosed';
import ExitPoolConnector from '../../connectors/ExitPoolConnector';
import NotLoggedInConnector from '../../connectors/NotLoggedInConnector';

import s from './MarketPage.module.scss';

interface RouterParams {
    marketId: string;
}

export default function MarketPage() {
    const dispatch = useDispatch();
    const account = useSelector((store: Reducers) => store.account.account);
    const market = useSelector((store: Reducers) => store.market.marketDetail);
    const poolToken = useSelector((store: Reducers) => store.market.poolTokenBalance);
    const { marketId } = useParams<RouterParams>();

    useEffect(() => {
        dispatch(fetchMarketById(marketId));
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
                            show: account !== null && market?.public === true && market?.finalized === false,
                            id: '0',
                        }, {
                            element: <LiquidityProviderConnector key="liquidity" />,
                            label: trans('market.label.liquidity'),
                            show: account !== null && market?.public === true && market?.finalized === false,
                            id: '1',
                        }, {
                            element: <ClaimEarningsConnector key="claimEarnings" />,
                            label: trans('market.label.claimEarnings'),
                            show: account !== null && market?.finalized === true,
                            id: '2',
                        }, {
                            element: <SeedPoolConnector key="seedpool" />,
                            label: trans('market.label.seedPool'),
                            show: account !== null && market?.finalized === false && market.public === false && market.resolutionDate > new Date(),
                            id: '3',
                        }, {
                            element: <MarketClosed key="marketClosed" />,
                            label: trans('market.label.marketClosed'),
                            show: account !== null && market?.finalized === false && market.resolutionDate <= new Date(),
                            id: '4',
                        }, {
                            element: <ExitPoolConnector key="exitPool" />,
                            label: trans('market.label.exitPool'),
                            show: account !== null && market?.public === true && !!poolToken,
                            id: '5',
                        }, {
                            element: <NotLoggedInConnector key="notloggedin" />,
                            label: trans('market.label.notLoggedIn'),
                            show: account === null,
                            id: '5',
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
