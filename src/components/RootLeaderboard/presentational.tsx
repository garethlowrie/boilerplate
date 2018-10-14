import * as React from 'react';
import Dialog from 'src/components/Dialog/presentational';
import posed from 'react-pose';
import { Query } from "react-apollo";
import gql from "graphql-tag";
import LeaderboardTable from 'src/components/LeaderboardTable/presentational';
import { ApolloError } from 'apollo-client';
import Flex, { FlexItem } from 'styled-flex-component';
import styles from './styles.less';
import LANG from 'src/constants/lang';

interface IPropTypes {
	winner: string;
	onClose: React.MouseEventHandler<any>;
	winningScore: number;
}

const Container = posed.div({
	exit: {
		opacity: 0,
		delay: 300
	},
	enter: {
		opacity: 1,
		delay: 300
	}
});

const QUERY = gql`
	query TopPlayers($quantity: Int){
		topPlayers(quantity: $quantity) {
			name
			score
		}
	}
`;

const RootLeaderboard: React.SFC<IPropTypes> = ({
	winner,
	winningScore,
	onClose,
	...props
}) => {
	return (
		<Container {...props}>
			<Dialog title={`🏆 ${LANG.leaderboard}`} onClose={onClose}>
				<Flex full column className={styles.dialogBodyContainer}>
					<FlexItem>
						<div className={styles.winningScoreContainer}>
							<div className={styles.winningScore}>
								<div className={styles.text}>{winningScore}</div>
							</div>
						</div>
						<div className={styles.winner}>
							<span className={styles.winnerName}>{winner}</span> {LANG.winsThisRound}
						</div>
					</FlexItem>
					<Query
						query={QUERY}
						variables={{ quantity: 5 }}
					>
						{({ loading, error, data }) => {
							const isErrored = error instanceof ApolloError;
							return (
								<LeaderboardTable isLoading={loading} isErrored={isErrored} data={data.topPlayers} />
							)
						}}
					</Query>
				</Flex>
			</Dialog>
		</Container>
	)
};

export default RootLeaderboard;
