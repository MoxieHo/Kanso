import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import styled from "styled-components";
import CodeBlock from "../components/CodeBlock";
import ImageBlock from "../components/ImageBlock";
import HeadingBlock from "../components/HeadingBlock";
import FrameBlock from "../components/FrameBlock";
import { Typography, TimeBar } from "@kindle-ui/core";
import { paths, giscus as giscusConfig } from "../../../site.config";
import matter from "gray-matter";
import parseDate from "@/utils/parseDateStr";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { GetStaticProps, GetStaticPaths } from "next";
import remarkGfm from "remark-gfm";
import Giscus from "@giscus/react";
import { useColorScheme } from "src/contexts/colorScheme";

function formatDate(dateString: string, locale: string): string {
	const date = new Date(dateString);

	if (locale === "zh-CN") {
		const year = date.getFullYear();
		const month = date.getMonth() + 1;
		const day = date.getDate();
		return `${year} 年 ${month} 月 ${day} 日`;
	} else {
		const options: Intl.DateTimeFormatOptions = {
			year: "numeric",
			month: "short",
			day: "numeric",
		};
		return date.toLocaleDateString("en-US", options);
	}
}

const Cover = styled.div`
	img {
		object-fit: cover;
		width: 100%;
		max-height: 40vh;
	}
	margin: 6px -10px 0 -10px;
`;

const CommentContainer = styled.div`
	padding: 0 12px;
`;

const StyledArticlePage = styled.div`
	padding: 0;
	overflow: hidden;

	@media (min-width: 1024px) {
		padding: 0 12px;
	}

	& section[itemProp="articleBody"] {
		font-family: "Bookerly", "Noto Serif SC";
	}
`;

const ArticlePage = ({ id, postProps, postContent, siteConfig, locale }) => {
	if (!postProps) return null;

	const { colorScheme } = useColorScheme();

	return (
		<div>
			<StyledArticlePage>
				<Cover>
					{typeof postProps.cover == "string" && (
						<>
							<ImageBlock alt="Cover" src={postProps.cover} />
							<meta
								itemProp="thumbnailUrl"
								content={postProps.cover}
							/>
						</>
					)}
				</Cover>
				<Typography itemScope itemType="http://schema.org/Article">
					<meta itemProp="mainEntityOfPage" content={id} />

					<h1 itemProp="headline">{postProps.title}</h1>
					<div className="Textc(secondary)">
						<time
							itemProp="datePublished"
							dateTime={postProps.date}
						>
							{formatDate(postProps.date, locale)}
						</time>
					</div>
					<meta itemProp="author" content={postProps.author} />
					<meta itemProp="publisher" content={siteConfig.author} />
					<meta itemProp="inLanguage" content={locale} />
					<br />
					<section itemProp="articleBody">
						<ReactMarkdown
							remarkPlugins={[remarkMath, remarkGfm]}
							rehypePlugins={[rehypeKatex]}
							components={{
								code: CodeBlock,
								heading: HeadingBlock,
								img: ImageBlock,
								iframe: FrameBlock,
							}}
							children={postContent}
						></ReactMarkdown>
					</section>
				</Typography>
			</StyledArticlePage>
			{giscusConfig.enabled && (
				<CommentContainer>
					<Giscus
						repo={giscusConfig.config.repo}
						repoId={giscusConfig.config.repoId}
						category={giscusConfig.config.category}
						categoryId={giscusConfig.config.categoryId}
						mapping="pathname"
						strict="0"
						reactions-enabled="1"
						emit-metadata="0"
						input-position="bottom"
						theme={
							colorScheme === "dark"
								? "noborder_dark"
								: "noborder_light"
						}
						lang={giscusConfig.config.lang}
						loading="lazy"
					></Giscus>
				</CommentContainer>
			)}
		</div>
	);
};

export default ArticlePage;
